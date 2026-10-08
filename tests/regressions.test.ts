import { PricingService } from '../src/services/pricing.service'
import { normalizePagination } from '../src/lib/pagination'
import { createLeadSchema, updateBookingSchema, updateQuotationSchema } from '../src/lib/validations'
import { calculateQuotationTotals } from '../src/lib/quotation-totals'
import { publicProject } from '../src/lib/public-project'
import type { Project } from '@prisma/client'

describe('regression coverage', () => {
  const base = { projectType: 'RESIDENTIAL' as const, qualityLevel: 'BASIC' as const,
    sqft: 100, services: [], timeline: 20, location: '00000', rooms: [] }
  it('does not double-charge room areas or produce NaN for no rooms', () => {
    const empty = PricingService.generateQuotation(base)
    const single = PricingService.generateQuotation({ ...base, rooms: [
      { name: 'Living', type: 'living', sqft: 100, condition: 'good' },
    ] })
    expect(empty.implementationCost).toBe(16025)
    expect(single.implementationCost).toBe(empty.implementationCost)
    expect(() => PricingService.generateQuotation({ ...base, sqft: 0 })).toThrow()
  })
  it('payment installments sum exactly to the total', () => {
    const result = PricingService.generateQuotation({ ...base, sqft: 101 })
    expect(Object.values(result.paymentSchedule).reduce((sum, item) => sum + item.amount, 0)).toBe(result.total)
  })
  it('bounds pagination', () => {
    expect(normalizePagination(-4, 100000)).toEqual({ page: 1, pageSize: 100 })
    expect(normalizePagination(NaN, 0)).toEqual({ page: 1, pageSize: 20 })
  })
  it('accepts contact form fields and preserves the message', () => {
    expect(createLeadSchema.parse({ name: 'Test User', email: 'test@example.com', source: 'WEBSITE', message: 'Hello', interestedIn: 'Design' }).message).toBe('Hello')
  })
  it('rejects invalid statuses and strips unauthorized update fields', () => {
    expect(updateBookingSchema.safeParse({ status: 'CONFIRMED' }).success).toBe(false)
    expect(updateQuotationSchema.parse({ status: 'SENT', total: 1, clientId: 'attacker' })).toEqual({ status: 'SENT' })
  })
  it('calculates quotation amounts instead of trusting submitted totals', () => {
    const result = calculateQuotationTotals({ items: [{ service: 'Design', quantity: 3, rate: 0.1, amount: 999 }], tax: 0.1, discount: 0.05 } as any)
    expect(result.items[0].amount).toBe(0.3)
    expect(result.total.toString()).toBe('0.35')
    expect(() => calculateQuotationTotals({ items: [{ quantity: 1, rate: 10 }], discount: 20 } as any)).toThrow()
  })
  it('does not expose private CRM data in public projects', () => {
    const project = publicProject({ id: 'p', title: 'Test', budget: 100, actualCost: 90, clientId: 'c', createdById: 'u', client: { email: 'secret' } } as unknown as Project)
    expect(project.title).toBe('Test')
    for (const key of ['budget', 'actualCost', 'clientId', 'createdById', 'client']) expect(project).not.toHaveProperty(key)
  })
})
