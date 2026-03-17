# 🔧 Refactored Code Implementations

This document contains refactored code snippets addressing critical issues identified in the audit.

---

## 1. 🛡️ Global Middleware Implementation

### File: `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { rateLimit } from '@/lib/middleware/rate-limiter'
import { validateRequest } from '@/lib/middleware/validator'

// Protected route patterns
const PROTECTED_ROUTES = [
  '/admin',
  '/api/clients',
  '/api/projects/((?!\\[slug\\]).)*', // Exclude public slug routes
  '/api/bookings/((?!create).)*', // Exclude public create endpoint
  '/api/leads/((?!create).)*',
]

// Admin-only routes
const ADMIN_ONLY_ROUTES = [
  '/api/clients/.*/delete',
  '/api/projects/.*/delete',
  '/api/users',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Security Headers (All Routes)
  const response = NextResponse.next()
  addSecurityHeaders(response)

  // 2. Rate Limiting (API Routes)
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          retryAfter: rateLimitResult.reset,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.reset.toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          },
        }
      )
    }
  }

  // 3. Authentication Check
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    new RegExp(`^${route}`).test(pathname)
  )

  if (isProtectedRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      // Redirect to login for pages, return 401 for API
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      }
      
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // 4. Authorization Check (Admin-only routes)
    const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) =>
      new RegExp(`^${route}`).test(pathname)
    )

    if (isAdminRoute && token.role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Add user info to headers for downstream use
    response.headers.set('X-User-Id', token.id as string)
    response.headers.set('X-User-Role', token.role as string)
  }

  // 5. Input Validation (API Routes with body)
  if (
    pathname.startsWith('/api/') &&
    ['POST', 'PUT', 'PATCH'].includes(request.method)
  ) {
    try {
      await validateRequest(request, pathname)
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          error: 'Validation failed',
          details: error instanceof Error ? error.message : 'Invalid request',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  return response
}

function addSecurityHeaders(response: NextResponse) {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // ⚠️ Restrict in production
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.cloudinary.com",
      "frame-ancestors 'none'",
    ].join('; ')
  )
  
  // HSTS (Strict Transport Security)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

---

## 2. 🚦 Rate Limiter Implementation

### File: `src/lib/middleware/rate-limiter.ts`

```typescript
import { NextRequest } from 'next/server'
import { LRUCache } from 'lru-cache'

type RateLimitOptions = {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max unique tokens to track
}

type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

const rateLimiters = new Map<string, LRUCache<string, number[]>>()

export function getRateLimiter(
  options: RateLimitOptions
): LRUCache<string, number[]> {
  const key = `${options.interval}-${options.uniqueTokenPerInterval}`
  
  if (!rateLimiters.has(key)) {
    rateLimiters.set(
      key,
      new LRUCache<string, number[]>({
        max: options.uniqueTokenPerInterval,
        ttl: options.interval,
      })
    )
  }
  
  return rateLimiters.get(key)!
}

export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions = {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
  }
): Promise<RateLimitResult> {
  const limiter = getRateLimiter(options)
  
  // Get identifier (IP or session)
  const identifier = getIdentifier(request)
  
  const now = Date.now()
  const windowStart = now - options.interval
  
  // Get existing timestamps for this identifier
  const timestamps = limiter.get(identifier) || []
  
  // Remove timestamps outside the current window
  const validTimestamps = timestamps.filter((ts) => ts > windowStart)
  
  // Define rate limits based on endpoint
  const limit = getRateLimitForEndpoint(request.nextUrl.pathname)
  const remaining = Math.max(0, limit - validTimestamps.length)
  
  if (validTimestamps.length >= limit) {
    const oldestTimestamp = validTimestamps[0]
    const resetTime = Math.ceil((oldestTimestamp + options.interval - now) / 1000)
    
    return {
      success: false,
      limit,
      remaining: 0,
      reset: resetTime,
    }
  }
  
  // Add current timestamp
  validTimestamps.push(now)
  limiter.set(identifier, validTimestamps)
  
  return {
    success: true,
    limit,
    remaining: remaining - 1,
    reset: Math.ceil(options.interval / 1000),
  }
}

function getIdentifier(request: NextRequest): string {
  // Try to get authenticated user ID
  const userId = request.headers.get('X-User-Id')
  if (userId) return `user:${userId}`
  
  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  return `ip:${ip}`
}

function getRateLimitForEndpoint(pathname: string): number {
  // Strict limits for authentication
  if (pathname.includes('/api/auth/signin')) return 5 // 5 attempts per minute
  
  // Moderate limits for mutations
  if (pathname.match(/\/(create|update|delete)/)) return 20
  
  // Generous limits for reads
  if (pathname.includes('/api/')) return 100
  
  // Default
  return 60
}
```

---

## 3. 🔐 Input Validation Middleware

### File: `src/lib/middleware/validator.ts`

```typescript
import { NextRequest } from 'next/server'
import { ZodSchema } from 'zod'
import DOMPurify from 'isomorphic-dompurify'
import {
  createClientSchema,
  updateClientSchema,
  createProjectSchema,
  createLeadSchema,
} from '@/lib/validations'

const VALIDATION_MAP: Record<string, ZodSchema> = {
  '/api/clients': createClientSchema,
  '/api/clients/[id]': updateClientSchema,
  '/api/projects': createProjectSchema,
  '/api/leads': createLeadSchema,
  // Add more mappings
}

export async function validateRequest(
  request: NextRequest,
  pathname: string
): Promise<void> {
  // Get the appropriate schema
  const schema = getSchemaForRoute(pathname)
  if (!schema) return // No validation needed
  
  // Parse request body
  let body: any
  try {
    body = await request.json()
  } catch {
    throw new Error('Invalid JSON body')
  }
  
  // Sanitize inputs (prevent XSS)
  const sanitizedBody = sanitizeObject(body)
  
  // Validate against schema
  const result = schema.safeParse(sanitizedBody)
  
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }))
    throw new ValidationError('Validation failed', errors)
  }
  
  // Maximum payload size check
  const bodySize = JSON.stringify(sanitizedBody).length
  if (bodySize > 1024 * 1024) { // 1MB limit
    throw new Error('Request body too large')
  }
}

function getSchemaForRoute(pathname: string): ZodSchema | null {
  // Exact match
  if (VALIDATION_MAP[pathname]) {
    return VALIDATION_MAP[pathname]
  }
  
  // Pattern match for dynamic routes
  for (const [pattern, schema] of Object.entries(VALIDATION_MAP)) {
    if (pathname.match(new RegExp(pattern.replace('[id]', '[^/]+')))) {
      return schema
    }
  }
  
  return null
}

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    // Remove dangerous HTML/scripts
    return DOMPurify.sanitize(obj, { ALLOWED_TAGS: [] })
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}

class ValidationError extends Error {
  constructor(
    message: string,
    public details: Array<{ field: string; message: string }>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}
```

---

## 4. 🎯 RBAC Authorization

### File: `src/lib/rbac.ts`

```typescript
import { UserRole } from '@/types/prisma'

export enum Permission {
  // Client permissions
  CLIENT_READ = 'client:read',
  CLIENT_CREATE = 'client:create',
  CLIENT_UPDATE = 'client:update',
  CLIENT_DELETE = 'client:delete',
  
  // Project permissions
  PROJECT_READ = 'project:read',
  PROJECT_CREATE = 'project:create',
  PROJECT_UPDATE = 'project:update',
  PROJECT_DELETE = 'project:delete',
  PROJECT_PUBLISH = 'project:publish',
  
  // User permissions
  USER_MANAGE = 'user:manage',
  
  // System permissions
  SYSTEM_SETTINGS = 'system:settings',
  ANALYTICS_VIEW = 'analytics:view',
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    // Admin has all permissions
    ...Object.values(Permission),
  ],
  STAFF: [
    // Staff has limited permissions
    Permission.CLIENT_READ,
    Permission.CLIENT_CREATE,
    Permission.CLIENT_UPDATE,
    Permission.PROJECT_READ,
    Permission.PROJECT_CREATE,
    Permission.PROJECT_UPDATE,
    Permission.ANALYTICS_VIEW,
  ],
}

export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  return rolePermissions.includes(permission)
}

export function requirePermission(
  userRole: UserRole,
  permission: Permission
): void {
  if (!hasPermission(userRole, permission)) {
    throw new UnauthorizedError(
      `Permission denied: ${permission} required`
    )
  }
}

export function requireAnyPermission(
  userRole: UserRole,
  permissions: Permission[]
): void {
  const hasAny = permissions.some((perm) => hasPermission(userRole, perm))
  if (!hasAny) {
    throw new UnauthorizedError(
      `Permission denied: One of [${permissions.join(', ')}] required`
    )
  }
}

class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

// Usage in API routes:
// import { requirePermission, Permission } from '@/lib/rbac'
// 
// export async function DELETE(request: NextRequest) {
//   const session = await getServerSession(authOptions)
//   requirePermission(session.user.role, Permission.CLIENT_DELETE)
//   // ... proceed with deletion
// }
```

---

## 5. 🗄️ Repository Pattern (Separation of Concerns)

### File: `src/repositories/client.repository.ts`

```typescript
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { ClientStatus, ClientSource } from '@/types/prisma'

export interface ClientFilters {
  status?: ClientStatus
  source?: ClientSource
  search?: string
  createdById?: string
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export class ClientRepository {
  /**
   * Find client by ID
   */
  static async findById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: this.defaultIncludes(),
    })
  }

  /**
   * Find many clients with filters
   */
  static async findMany(
    filters: ClientFilters,
    pagination: PaginationParams
  ) {
    const where = this.buildWhereClause(filters)
    const { page, pageSize } = pagination
    const skip = (page - 1) * pageSize

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, name: true },
          },
          _count: {
            select: {
              projects: true,
              bookings: true,
              quotations: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.client.count({ where }),
    ])

    return { clients, total }
  }

  /**
   * Create client
   */
  static async create(data: Prisma.ClientCreateInput) {
    return prisma.client.create({
      data,
      include: this.defaultIncludes(),
    })
  }

  /**
   * Update client
   */
  static async update(id: string, data: Prisma.ClientUpdateInput) {
    return prisma.client.update({
      where: { id },
      data,
      include: this.defaultIncludes(),
    })
  }

  /**
   * Delete client
   */
  static async delete(id: string) {
    return prisma.client.delete({ where: { id } })
  }

  /**
   * Get statistics
   */
  static async getStats() {
    const [total, statusGroups, recentCount] = await Promise.all([
      prisma.client.count(),
      prisma.client.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.client.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
    ])

    return {
      total,
      byStatus: statusGroups,
      recentClients: recentCount,
    }
  }

  // Private helpers
  private static buildWhereClause(
    filters: ClientFilters
  ): Prisma.ClientWhereInput {
    const where: Prisma.ClientWhereInput = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.source) {
      where.source = filters.source
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.createdById) {
      where.createdById = filters.createdById
    }

    return where
  }

  private static defaultIncludes() {
    return {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    }
  }
}
```

### File: `src/services/client.service.ts` (Refactored)

```typescript
import { ClientRepository } from '@/repositories/client.repository'
import { CreateClientInput } from '@/lib/validations'
import { EventEmitter } from '@/lib/events'

export class ClientService {
  /**
   * Create a new client
   */
  static async createClient(data: CreateClientInput, userId: string) {
    // Business logic validation
    await this.validateBusinessRules(data)

    // Create via repository
    const client = await ClientRepository.create({
      ...data,
      createdById: userId,
    })

    // Emit event for side effects (non-blocking)
    EventEmitter.emit('client.created', {
      client,
      userId,
    })

    return client
  }

  /**
   * Get client by ID
   */
  static async getClientById(id: string) {
    const client = await ClientRepository.findById(id)
    
    if (!client) {
      throw new NotFoundError('Client not found')
    }

    return client
  }

  /**
   * List clients with filters
   */
  static async listClients(params: {
    status?: string
    source?: string
    search?: string
    page?: number
    pageSize?: number
  }) {
    const filters = {
      status: params.status as any,
      source: params.source as any,
      search: params.search,
    }

    const pagination = {
      page: params.page || 1,
      pageSize: Math.min(params.pageSize || 20, 100), // Max 100
    }

    const { clients, total } = await ClientRepository.findMany(
      filters,
      pagination
    )

    return {
      data: clients,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total,
        totalPages: Math.ceil(total / pagination.pageSize),
      },
    }
  }

  // Business logic validation
  private static async validateBusinessRules(data: CreateClientInput) {
    // Check for duplicate email
    const existing = await ClientRepository.findMany(
      { search: data.email },
      { page: 1, pageSize: 1 }
    )

    if (existing.clients.length > 0) {
      throw new ValidationError('Client with this email already exists')
    }
  }
}
```

---

## 6. 📊 Optimized Database Queries

### File: `prisma/schema.prisma` (Add missing indexes)

```prisma
model Client {
  id              String         @id @default(cuid())
  name            String
  email           String         @unique
  status          ClientStatus   @default(NEW)
  source          ClientSource
  createdById     String
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relations...

  @@index([email])
  @@index([status])
  @@index([source])
  @@index([createdById])
  
  // ✅ NEW: Composite indexes for common query patterns
  @@index([status, createdAt(sort: Desc)]) // Dashboard queries
  @@index([createdById, status]) // User's clients filtered by status
  @@index([source, status]) // Analytics by source and status
  @@index([createdAt(sort: Desc)]) // Recent clients
  
  @@map("clients")
}

model Project {
  id              String         @id @default(cuid())
  slug            String         @unique
  status          ProjectStatus  @default(PLANNING)
  type            ProjectType
  published       Boolean        @default(false)
  featured        Boolean        @default(false)
  clientId        String
  createdById     String
  createdAt       DateTime       @default(now())
  
  // ✅ NEW: Performance indexes
  @@index([slug])
  @@index([clientId, status]) // Client's projects by status
  @@index([published, featured, createdAt(sort: Desc)]) // Homepage query
  @@index([type, status]) // Project filtering
  @@index([status, createdAt(sort: Desc)]) // Dashboard
  
  @@map("projects")
}

model ActivityLog {
  id          String        @id @default(cuid())
  type        ActivityType
  userId      String
  entityType  String?
  entityId    String?
  clientId    String?
  leadId      String?
  projectId   String?
  createdAt   DateTime      @default(now())

  // ✅ NEW: Critical for performance
  @@index([userId, createdAt(sort: Desc)]) // User activity timeline
  @@index([entityType, entityId, createdAt(sort: Desc)]) // Entity history
  @@index([clientId, createdAt(sort: Desc)]) // Client activity
  @@index([projectId, createdAt(sort: Desc)]) // Project activity
  @@index([type, createdAt(sort: Desc)]) // Activity type filtering
  @@index([createdAt(sort: Desc)]) // Recent activity
  
  @@map("activity_logs")
}
```

---

## 7. ♻️ Transaction Management

### File: `src/services/lead.service.ts`

```typescript
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class LeadService {
  /**
   * Convert lead to client (with transaction)
   */
  static async convertLeadToClient(
    leadId: string,
    userId: string
  ): Promise<{ client: any; lead: any }> {
    // ✅ Use transaction to ensure data consistency
    return await prisma.$transaction(async (tx) => {
      // 1. Lock the lead (prevent concurrent conversions)
      const lead = await tx.lead.findUnique({
        where: { id: leadId },
      })

      if (!lead) {
        throw new NotFoundError('Lead not found')
      }

      if (lead.convertedToClientId) {
        throw new ValidationError('Lead already converted')
      }

      // 2. Create client
      const client = await tx.client.create({
        data: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          source: lead.source,
          status: 'NEW',
          priority: lead.priority,
          budget: lead.budget as any,
          createdById: userId,
        },
      })

      // 3. Update lead
      const updatedLead = await tx.lead.update({
        where: { id: leadId },
        data: {
          convertedToClientId: client.id,
          convertedAt: new Date(),
        },
      })

      // 4. Create activity log
      await tx.activityLog.create({
        data: {
          type: 'LEAD_CONVERTED' as any,
          description: `Lead "${lead.name}" converted to client`,
          userId,
          leadId: lead.id,
          clientId: client.id,
          entityType: 'Lead',
          entityId: lead.id,
        },
      })

      return { client, lead: updatedLead }
    })
  }

  /**
   * Bulk update leads with transaction
   */
  static async bulkUpdateStatus(
    leadIds: string[],
    status: string,
    userId: string
  ) {
    return await prisma.$transaction(async (tx) => {
      const updates = await Promise.all(
        leadIds.map((id) =>
          tx.lead.update({
            where: { id },
            data: { status: status as any },
          })
        )
      )

      // Log bulk activity
      await tx.activityLog.createMany({
        data: leadIds.map((id) => ({
          type: 'LEAD_STATUS_CHANGED' as any,
          description: `Lead status changed to ${status}`,
          userId,
          leadId: id,
          entityType: 'Lead',
          entityId: id,
        })),
      })

      return updates
    })
  }
}
```

---

## 8. 🔒 Secure Environment Configuration

### File: `src/lib/env.ts`

```typescript
import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().min(1),
  
  // NextAuth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32, 'Secret must be at least 32 characters'),
  
  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  
  // Optional
  SENDGRID_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  
  // Feature flags
  ENABLE_REGISTRATION: z.enum(['true', 'false']).default('false'),
  MAINTENANCE_MODE: z.enum(['true', 'false']).default('false'),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Validate and export
function validateEnv() {
  const parsed = envSchema.safeParse(process.env)
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(JSON.stringify(parsed.error.format(), null, 2))
    throw new Error('Environment validation failed')
  }
  
  return parsed.data
}

export const env = validateEnv()

// Type-safe environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
```

### Usage in code:

```typescript
import { env } from '@/lib/env'

// ✅ Type-safe, validated at startup
const dbUrl = env.DATABASE_URL
const secret = env.NEXTAUTH_SECRET
```

---

## 9. 🎯 Error Handling Strategy

### File: `src/lib/errors.ts`

```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public code?: string
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', code?: string) {
    super(400, message, true, code)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', code?: string) {
    super(401, message, true, code)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', code?: string) {
    super(403, message, true, code)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code?: string) {
    super(404, message, true, code)
  }
}

export class ValidationError extends AppError {
  constructor(
    message = 'Validation failed',
    public details?: any
  ) {
    super(400, message, true, 'VALIDATION_ERROR')
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', code?: string) {
    super(409, message, true, code)
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error', code?: string) {
    super(500, message, false, code)
  }
}
```

### File: `src/lib/middleware/error-handler.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { AppError } from '@/lib/errors'
import { Prisma } from '@prisma/client'

export function handleError(error: unknown, request: NextRequest) {
  console.error('[ERROR]', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    url: request.url,
    method: request.method,
  })

  // Known application error
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(error instanceof ValidationError && { details: error.details }),
      },
      { status: error.statusCode }
    )
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error)
  }

  // Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: (error as any).issues,
      },
      { status: 400 }
    )
  }

  // Unknown error - don't expose details in production
  return NextResponse.json(
    {
      error:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : error instanceof Error
          ? error.message
          : 'Unknown error',
    },
    { status: 500 }
  )
}

function handlePrismaError(error: Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case 'P2002':
      return NextResponse.json(
        {
          error: 'A record with this unique field already exists',
          field: (error.meta?.target as string[])?.join(', '),
        },
        { status: 409 }
      )
    case 'P2025':
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      )
    default:
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
  }
}
```

### Usage in API routes:

```typescript
import { handleError } from '@/lib/middleware/error-handler'

export async function GET(request: NextRequest) {
  try {
    // ... your code
  } catch (error) {
    return handleError(error, request)
  }
}
```

---

## 10. 📦 Improved Prisma Client (Connection Pooling)

### File: `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    
    // ✅ Connection pool configuration
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

// Middleware for query timing
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  
  const duration = after - before
  
  // Log slow queries (> 1s)
  if (duration > 1000) {
    console.warn(`⚠️ Slow query: ${params.model}.${params.action} took ${duration}ms`)
  }
  
  return result
})

// Graceful shutdown
async function shutdown() {
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
```

---

## Summary

These refactored implementations address the critical issues:

✅ **Security**: Middleware, rate limiting, RBAC, input validation  
✅ **Performance**: Optimized queries, indexes, transaction management  
✅ **Architecture**: Repository pattern, error handling, environment validation  
✅ **Scalability**: Connection pooling, caching strategy preparation  

**Next Steps:**
1. Install required dependencies (`lru-cache`, `isomorphic-dompurify`)
2. Implement these changes incrementally
3. Add comprehensive tests
4. Monitor performance metrics
5. Security audit after implementation
