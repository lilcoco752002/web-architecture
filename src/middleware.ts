import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { rateLimit } from './lib/rate-limit'

// Define protected routes that require authentication
const protectedPaths = [
  '/api/projects',
  '/api/services',
  '/api/bookings',
  '/api/leads',
  '/api/quotations',
  '/api/invoices',
  '/api/payments',
  '/admin',
]

// Define admin-only routes
const adminPaths = [
  '/api/users',
  '/api/analytics',
  '/admin',
]

// Public API routes that don't require authentication
const publicPaths = [
  '/api/auth',
  '/api/contact',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    publicPaths.some(path => pathname.startsWith(path))
  ) {
    return NextResponse.next()
  }

  // Apply rate limiting to all API routes
  if (pathname.startsWith('/api')) {
    try {
      const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown'
      await rateLimit(ip, pathname)
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
  }

  // Check authentication for protected routes
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
      // Redirect to login for web pages
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    // Check admin authorization for admin-only routes
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

    // Add user info to headers for API routes
    if (pathname.startsWith('/api')) {
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', token.sub || '')
      requestHeaders.set('x-user-role', token.role || 'USER')
      requestHeaders.set('x-user-email', token.email || '')

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
