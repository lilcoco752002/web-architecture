import { Prisma } from '@prisma/client'
import type { CreateQuotationInput } from './validations'
import { z } from 'zod'

export function calculateQuotationTotals(data: CreateQuotationInput) {
  const items = data.items.map(item => ({
    ...item,
    amount: new Prisma.Decimal(item.rate).mul(item.quantity).toDecimalPlaces(2).toNumber(),
  }))
  const subtotal = items.reduce((sum, item) => sum.add(item.amount), new Prisma.Decimal(0))
  const tax = new Prisma.Decimal(data.tax ?? 0).toDecimalPlaces(2)
  const discount = new Prisma.Decimal(data.discount ?? 0).toDecimalPlaces(2)
  const total = subtotal.add(tax).sub(discount)
  if (total.lte(0) || total.greaterThan('99999999.99')) {
    throw new z.ZodError([{ code: 'custom', path: ['total'], message: 'Total is outside the supported range' }])
  }
  return { items, subtotal, tax, discount, total }
}
