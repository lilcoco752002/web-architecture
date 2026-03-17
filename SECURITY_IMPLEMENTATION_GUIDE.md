# 🔐 Security Implementation Files

## File 1: Enhanced Middleware with HTTPS & CSP

**File:** `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { rateLimit } from './lib/rate-limit-enhanced'

const protectedPaths = [
  '/api/projects',
  '/api/services',
  '/api/bookings',
  '/api/leads',
  '/api/quotations',
  '/api/invoices',
  '/api/payments',
  '/api/clients',
  '/admin',
]

const adminPaths = [
  '/api/users',
  '/api/analytics',
  '/admin',
]

const publicPaths = [
  '/api/auth',
  '/api/contact',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Force HTTPS in production
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${pathname}${request.nextUrl.search}`,
      301
    )
  }

  // Skip middleware for static files and public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    publicPaths.some(path => pathname.startsWith(path))
  ) {
    return NextResponse.next()
  }

  // 2. Apply enhanced rate limiting
  if (pathname.startsWith('/api')) {
    try {
      const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
      await rateLimit(ip, pathname, token?.sub)
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Remaining': '0',
          }
        }
      )
    }
  }

  // 3. Authentication check
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  if (isProtectedPath) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    // 4. Authorization check
    const isAdminPath = adminPaths.some(path => pathname.startsWith(path))
    if (isAdminPath && token.role !== 'ADMIN') {
      if (pathname.startsWith('/api')) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 5. Add user context to headers
    if (pathname.startsWith('/api')) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', token.sub || '')
      requestHeaders.set('x-user-role', token.role || 'USER')
      requestHeaders.set('x-user-email', token.email || '')

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
      
      // Add security headers to API responses
      addSecurityHeaders(response)
      return response
    }
  }

  const response = NextResponse.next()
  
  // 6. Add security headers to all responses
  addSecurityHeaders(response)
  
  return response
}

function addSecurityHeaders(response: NextResponse) {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // TODO: Remove unsafe-inline in production
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://res.cloudinary.com blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://res.cloudinary.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  )

  // Strict Transport Security (HSTS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY')

  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions-Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

---

## File 2: Enhanced Rate Limiting

**File:** `src/lib/rate-limit-enhanced.ts`

```typescript
// Enhanced rate limiter with endpoint-specific limits and Redis support

interface RateLimitConfig {
  window: number // milliseconds
  max: number
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/auth/signin': { window: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15min
  '/api/auth/signup': { window: 60 * 60 * 1000, max: 3 }, // 3 signups per hour
  '/api/contact': { window: 60 * 1000, max: 3 }, // 3 contacts per minute
  '/api/leads': { window: 60 * 1000, max: 5 }, // 5 leads per minute
  default: { window: 60 * 1000, max: 60 }, // 60 requests per minute
}

// In-memory store (replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(
  identifier: string,
  path: string,
  userId?: string
): Promise<void> {
  // Use userId if authenticated, otherwise use IP
  const key = userId ? `user:${userId}:${path}` : `ip:${identifier}:${path}`
  
  // Get config for this endpoint
  const config = Object.keys(RATE_LIMITS).find(pattern => 
    path.startsWith(pattern)
  )
  const limits = config ? RATE_LIMITS[config] : RATE_LIMITS.default
  
  const now = Date.now()
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + limits.window,
    })
    return
  }
  
  if (record.count >= limits.max) {
    throw new Error(`Rate limit exceeded for ${path}`)
  }
  
  record.count++
  rateLimitStore.set(key, record)
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 1000) // Every minute

// Redis implementation (for production)
/*
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export async function rateLimit(
  identifier: string,
  path: string,
  userId?: string
): Promise<void> {
  const key = userId ? `rl:user:${userId}:${path}` : `rl:ip:${identifier}:${path}`
  
  const config = Object.keys(RATE_LIMITS).find(pattern => 
    path.startsWith(pattern)
  )
  const limits = config ? RATE_LIMITS[config] : RATE_LIMITS.default
  
  const count = await redis.incr(key)
  
  if (count === 1) {
    await redis.expire(key, Math.ceil(limits.window / 1000))
  }
  
  if (count > limits.max) {
    throw new Error(`Rate limit exceeded for ${path}`)
  }
}
*/
```

---

## File 3: Enhanced Auth Configuration

**File:** `src/lib/auth.ts` (Updated)

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compare } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { logSecurityEvent } from '@/lib/security-logger'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Refresh token every 24 hours
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // Must match session maxAge
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          await logSecurityEvent({
            eventType: 'LOGIN_FAILED',
            metadata: { email: credentials.email, reason: 'user_not_found' },
            ipAddress: req?.headers?.['x-forwarded-for'] || 'unknown',
            userAgent: req?.headers?.['user-agent'],
          })
          throw new Error('Invalid credentials')
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          await logSecurityEvent({
            eventType: 'LOGIN_LOCKED',
            userId: user.id,
            metadata: { email: credentials.email, lockedUntil: user.lockedUntil },
            ipAddress: req?.headers?.['x-forwarded-for'] || 'unknown',
            userAgent: req?.headers?.['user-agent'],
          })
          throw new Error('Account is temporarily locked. Please try again later.')
        }

        if (user.status !== 'ACTIVE') {
          throw new Error('Account is not active')
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          // Increment failed attempts
          const newFailedAttempts = (user.failedLoginAttempts || 0) + 1
          const shouldLock = newFailedAttempts >= 5
          
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: newFailedAttempts,
              lockedUntil: shouldLock 
                ? new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
                : null
            }
          })

          await logSecurityEvent({
            eventType: 'LOGIN_FAILED',
            userId: user.id,
            metadata: { 
              email: credentials.email, 
              reason: 'invalid_password',
              attempts: newFailedAttempts,
              locked: shouldLock
            },
            ipAddress: req?.headers?.['x-forwarded-for'] || 'unknown',
            userAgent: req?.headers?.['user-agent'],
          })

          throw new Error('Invalid credentials')
        }

        // Reset failed attempts on successful login
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            failedLoginAttempts: 0, 
            lockedUntil: null,
            lastLoginAt: new Date()
          },
        })

        await logSecurityEvent({
          eventType: 'LOGIN_SUCCESS',
          userId: user.id,
          metadata: { email: credentials.email },
          ipAddress: req?.headers?.['x-forwarded-for'] || 'unknown',
          userAgent: req?.headers?.['user-agent'],
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = user.role || 'STAFF'
        token.avatar = user.avatar
      }
      
      // Rotate session on sensitive actions
      if (trigger === 'update') {
        token.iat = Math.floor(Date.now() / 1000)
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string | null
      }
      return session
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.sub) {
        await logSecurityEvent({
          eventType: 'LOGOUT',
          userId: token.sub,
          metadata: {},
          ipAddress: 'unknown', // Get from request in production
        })
      }
    },
  },
}

declare module 'next-auth' {
  interface User {
    role?: string
    avatar?: string | null
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      avatar?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    avatar?: string | null
  }
}
```

---

## File 4: Security Event Logger

**File:** `src/lib/security-logger.ts`

```typescript
import prisma from '@/lib/prisma'

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_LOCKED = 'LOGIN_LOCKED',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',
  DATA_EXPORTED = 'DATA_EXPORTED',
  DATA_DELETED = 'DATA_DELETED',
  API_KEY_CREATED = 'API_KEY_CREATED',
  API_KEY_REVOKED = 'API_KEY_REVOKED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

interface SecurityEvent {
  eventType: keyof typeof SecurityEventType
  userId?: string
  metadata: Record<string, any>
  ipAddress: string
  userAgent?: string
  severity?: 'info' | 'warning' | 'critical'
}

export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  try {
    // In production, use a dedicated logging service (e.g., Datadog, Splunk)
    await prisma.securityAuditLog.create({
      data: {
        eventType: event.eventType,
        userId: event.userId,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        metadata: event.metadata,
        severity: event.severity || getSeverity(event.eventType),
      },
    })

    // Alert on critical events
    if (event.severity === 'critical' || isCriticalEvent(event.eventType)) {
      await sendSecurityAlert(event)
    }
  } catch (error) {
    // Don't fail the request if logging fails
    console.error('Failed to log security event:', error)
  }
}

function getSeverity(eventType: string): 'info' | 'warning' | 'critical' {
  const criticalEvents = [
    'LOGIN_LOCKED',
    'ROLE_CHANGED',
    'PERMISSION_GRANTED',
    'DATA_DELETED',
    'SUSPICIOUS_ACTIVITY',
  ]
  
  const warningEvents = [
    'LOGIN_FAILED',
    'PASSWORD_RESET_REQUESTED',
    'RATE_LIMIT_EXCEEDED',
  ]
  
  if (criticalEvents.includes(eventType)) return 'critical'
  if (warningEvents.includes(eventType)) return 'warning'
  return 'info'
}

function isCriticalEvent(eventType: string): boolean {
  return getSeverity(eventType) === 'critical'
}

async function sendSecurityAlert(event: SecurityEvent): Promise<void> {
  // Implement alerting (email, Slack, PagerDuty, etc.)
  console.error('🚨 SECURITY ALERT:', event)
  
  // Example: Send email to security team
  // await sendEmail({
  //   to: 'security@agency.com',
  //   subject: `Security Alert: ${event.eventType}`,
  //   body: JSON.stringify(event, null, 2),
  // })
}

export async function getSecurityLogs(filters: {
  userId?: string
  eventType?: string
  severity?: string
  startDate?: Date
  endDate?: Date
  limit?: number
}) {
  return prisma.securityAuditLog.findMany({
    where: {
      userId: filters.userId,
      eventType: filters.eventType as any,
      severity: filters.severity as any,
      createdAt: {
        gte: filters.startDate,
        lte: filters.endDate,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: filters.limit || 100,
  })
}
```

---

## File 5: Enhanced Error Handling

**File:** `src/lib/errors.ts`

```typescript
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR')
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number = 60) {
    super('Too many requests', 429, 'RATE_LIMIT_EXCEEDED')
    this.statusCode = 429
  }
}

export function handleError(error: unknown): {
  error: string
  code: string
  details?: any
} {
  // Operational errors - safe to expose
  if (error instanceof AppError && error.isOperational) {
    return {
      error: error.message,
      code: error.code,
    }
  }

  // Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    return {
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: (error as any).issues,
    }
  }

  // Prisma errors - don't expose details
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as any
    
    if (prismaError.code === 'P2002') {
      return {
        error: 'A record with this value already exists',
        code: 'DUPLICATE_ENTRY',
      }
    }
    
    if (prismaError.code === 'P2025') {
      return {
        error: 'Record not found',
        code: 'NOT_FOUND',
      }
    }
  }

  // Log internal error but don't expose details
  console.error('Internal error:', error)

  return {
    error: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
  }
}
```

---

## File 6: Input Validation Middleware

**File:** `src/lib/validation.ts` (Enhanced)

```typescript
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// Common validation schemas
export const emailSchema = z.string().email().toLowerCase().trim()

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number (E.164 format)')
  .optional()

export const urlSchema = z.string().url().optional()

export const sanitizedStringSchema = (maxLength: number = 1000) =>
  z
    .string()
    .max(maxLength)
    .transform(val => DOMPurify.sanitize(val, { ALLOWED_TAGS: [] }))

// Enhanced lead schema
export const createLeadSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: emailSchema,
  phone: phoneSchema,
  company: sanitizedStringSchema(200).optional(),
  projectType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'HOSPITALITY']),
  budget: z.enum(['<25k', '25k-50k', '50k-100k', '100k-250k', '250k+']),
  timeline: z.string().max(100).optional(),
  message: sanitizedStringSchema(2000).optional(),
  source: z.enum(['WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'ADVERTISEMENT', 'OTHER']).optional(),
})

// Enhanced user schema with strong password
export const createUserSchema = z
  .object({
    email: emailSchema,
    password: z
      .string()
      .min(12, 'Password must be at least 12 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
      .refine(
        password => {
          // Check against common passwords
          const commonPasswords = [
            'password123',
            'admin123',
            'letmein',
            'welcome123',
            // Add more from common password lists
          ]
          return !commonPasswords.includes(password.toLowerCase())
        },
        { message: 'This password is too common' }
      ),
    name: z.string().min(2).max(100),
    role: z.enum(['ADMIN', 'STAFF']).optional(),
  })

// File upload validation
export const fileUploadSchema = z.object({
  file: z
    .custom<File>()
    .refine(file => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type),
      'Invalid file type'
    ),
})

// Sanitize HTML content
export function sanitizeHtml(html: string, allowedTags?: string[]): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags || ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  })
}

// Validate file signature (magic bytes)
export async function validateFileSignature(file: File): Promise<boolean> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  // Check file signatures
  const signatures: Record<string, number[]> = {
    'image/jpeg': [0xff, 0xd8, 0xff],
    'image/png': [0x89, 0x50, 0x4e, 0x47],
    'application/pdf': [0x25, 0x50, 0x44, 0x46],
  }

  const signature = signatures[file.type]
  if (!signature) return false

  for (let i = 0; i < signature.length; i++) {
    if (bytes[i] !== signature[i]) return false
  }

  return true
}
```

---

## File 7: Database Schema Updates

**File:** `prisma/schema.prisma` (Additions)

```prisma
// Add to User model
model User {
  id                    String       @id @default(cuid())
  email                 String       @unique
  password              String
  name                  String
  role                  UserRole     @default(STAFF)
  status                UserStatus   @default(ACTIVE)
  avatar                String?
  phone                 String?
  
  // Security fields
  failedLoginAttempts   Int          @default(0)
  lockedUntil           DateTime?
  lastLoginAt           DateTime?
  passwordChangedAt     DateTime?
  
  // Relations
  createdClients        Client[]      @relation("CreatedByUser")
  createdLeads          Lead[]        @relation("CreatedByUser")
  createdProjects       Project[]     @relation("CreatedByUser")
  createdBlogPosts      BlogPost[]    @relation("CreatedByUser")
  activityLogs          ActivityLog[]
  securityLogs          SecurityAuditLog[]
  passwordResetTokens   PasswordResetToken[]
  apiKeys               ApiKey[]
  dataExportRequests    DataExportRequest[]
  dataDeletionRequests  DataDeletionRequest[]
  
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
  
  @@index([email])
  @@index([role, status])
  @@index([lastLoginAt])
  @@index([status, lastLoginAt])
  @@index([lockedUntil])
  @@map("users")
}

// Security audit log
model SecurityAuditLog {
  id          String   @id @default(cuid())
  eventType   String
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  ipAddress   String
  userAgent   String?
  metadata    Json?
  severity    String   // info, warning, critical
  createdAt   DateTime @default(now())
  
  @@index([userId])
  @@index([eventType])
  @@index([createdAt(sort: Desc)])
  @@index([severity])
  @@map("security_audit_logs")
}

// Password reset tokens
model PasswordResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  used      Boolean  @default(false)
  usedAt    DateTime?
  createdAt DateTime @default(now())
  
  @@index([token])
  @@index([userId])
  @@index([expiresAt])
  @@map("password_reset_tokens")
}

// API keys for programmatic access
model ApiKey {
  id          String   @id @default(cuid())
  name        String
  key         String   @unique // Hashed
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  scopes      String[] // Array of permissions
  lastUsedAt  DateTime?
  expiresAt   DateTime?
  revokedAt   DateTime?
  createdAt   DateTime @default(now())
  
  @@index([userId])
  @@index([key])
  @@index([expiresAt])
  @@map("api_keys")
}

// GDPR: Consent tracking
model ConsentLog {
  id           String   @id @default(cuid())
  userId       String?
  ipAddress    String
  consentType  String   // marketing, analytics, cookies, etc.
  granted      Boolean
  version      String   // Privacy policy version
  metadata     Json?
  createdAt    DateTime @default(now())
  
  @@index([userId])
  @@index([consentType])
  @@index([createdAt(sort: Desc)])
  @@map("consent_logs")
}

// GDPR: Data export requests
model DataExportRequest {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  status      String   // pending, completed, failed
  downloadUrl String?
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
  completedAt DateTime?
  
  @@index([userId])
  @@index([status])
  @@map("data_export_requests")
}

// GDPR: Data deletion requests
model DataDeletionRequest {
  id          String   @id @default(cuid())
  userId      String
  status      String   // pending, completed
  reason      String?
  notes       String?
  completedAt DateTime?
  createdAt   DateTime @default(now())
  
  @@index([userId])
  @@index([status])
  @@map("data_deletion_requests")
}
```

---

## File 8: CORS Configuration

**File:** `src/lib/cors.ts`

```typescript
import { NextResponse } from 'next/server'

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  'https://yourdomain.com',
  'https://www.yourdomain.com',
  'https://admin.yourdomain.com',
]

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']

const ALLOWED_HEADERS = [
  'Content-Type',
  'Authorization',
  'X-Requested-With',
  'Accept',
]

export function setCorsHeaders(
  response: NextResponse,
  origin?: string | null
): NextResponse {
  // Check if origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (process.env.NODE_ENV === 'development') {
    // Allow all origins in development
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
  } else {
    // Use first allowed origin as default in production
    response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0])
  }

  response.headers.set('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '))
  response.headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS.join(', '))
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Max-Age', '86400') // 24 hours

  return response
}

export function handleCorsPreFlight(request: Request): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    const origin = request.headers.get('origin')
    return setCorsHeaders(response, origin)
  }
  return null
}
```

---

## File 9: Environment Variable Validation

**File:** `src/lib/env.ts`

```typescript
import { z } from 'zod'

const envSchema = z.object({
  // Node
  NODE_ENV: z.enum(['development', 'test', 'production']),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32, 'NEXTAUTH_SECRET must be at least 32 characters'),
  
  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  
  // Email
  EMAIL_FROM: z.string().email(),
  SENDGRID_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  
  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_NAME: z.string(),
  
  // Security
  ENCRYPTION_KEY: z.string().length(32).optional(),
  
  // Analytics (optional)
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  
  // Features
  ENABLE_REGISTRATION: z.enum(['true', 'false']).default('false'),
  MAINTENANCE_MODE: z.enum(['true', 'false']).default('false'),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:')
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
    }
    process.exit(1)
  }
}

export const env = validateEnv()
```

---

## File 10: Updated next.config.js

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  reactStrictMode: true,
  swcMinify: true,
  
  // Security headers (additional to middleware)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      // Force www (optional)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'yourdomain.com',
          },
        ],
        destination: 'https://www.yourdomain.com/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

---

## 🚀 Implementation Checklist

### Phase 1: Critical Security (Week 1)

- [ ] Update `src/lib/auth.ts` with session expiration
- [ ] Update `src/middleware.ts` with HTTPS enforcement & CSP
- [ ] Create `src/lib/rate-limit-enhanced.ts`
- [ ] Create `src/lib/security-logger.ts`
- [ ] Create `src/lib/errors.ts`
- [ ] Update database schema with security fields
- [ ] Run `npx prisma migrate dev --name add-security-fields`
- [ ] Test login with account lockout
- [ ] Test rate limiting on `/api/auth/signin`
- [ ] Verify HTTPS redirect in staging

### Phase 2: Validation & Error Handling (Week 2)

- [ ] Update `src/lib/validation.ts` with enhanced schemas
- [ ] Update all API routes to use new validation
- [ ] Update all API routes to use safe error handling
- [ ] Create `src/lib/cors.ts`
- [ ] Add CORS to API routes
- [ ] Test input validation with malicious payloads
- [ ] Test error responses don't expose internals

### Phase 3: GDPR Compliance (Week 3)

- [ ] Add GDPR models to schema
- [ ] Create privacy policy page
- [ ] Create cookie consent component
- [ ] Implement data export API
- [ ] Implement data deletion API
- [ ] Create consent management UI
- [ ] Test data export/deletion flows

### Phase 4: Testing & Deployment (Week 4)

- [ ] Security testing (OWASP Top 10)
- [ ] Load testing with rate limits
- [ ] Penetration testing
- [ ] Deploy to staging
- [ ] Monitor security logs
- [ ] Deploy to production

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GDPR Compliance Checklist](https://gdpr.eu/checklist/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Created:** February 5, 2026  
**Last Updated:** February 5, 2026  
**Version:** 1.0
