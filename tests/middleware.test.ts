import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { middleware } from '../src/middleware'
jest.mock('next-auth/jwt', () => ({ getToken: jest.fn() }))
jest.mock('../src/lib/rate-limit', () => ({ rateLimit: jest.fn() }))
const token = getToken as jest.Mock
const request = (path: string, method = 'GET') => new NextRequest(`http://localhost${path}`, { method })
beforeEach(() => token.mockResolvedValue(null))
it('allows login and exact public submission routes', async () => {
  for (const [path, method] of [['/admin/login', 'GET'], ['/api/leads', 'POST'], ['/api/bookings', 'POST'], ['/api/projects', 'GET']]) {
    expect((await middleware(request(path, method))).headers.get('x-middleware-next')).toBe('1')
  }
})
it('protects dotted paths and private reads', async () => {
  for (const path of ['/api/clients/a.b', '/api/leads', '/api/bookings/123', '/api/users']) {
    expect((await middleware(request(path))).status).toBe(401)
  }
})
it('allows staff CRM access but denies user administration', async () => {
  token.mockResolvedValue({ id: 'staff', role: 'STAFF' })
  expect((await middleware(request('/admin'))).headers.get('x-middleware-next')).toBe('1')
  expect((await middleware(request('/api/users'))).status).toBe(403)
})
