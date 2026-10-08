import { QuotationStatus as DbQuotationStatus } from '@prisma/client'
import { randomUUID } from 'crypto'
import { CreateQuotationInput, UpdateQuotationInput } from '@/lib/validations'
import { calculateQuotationTotals } from '@/lib/quotation-totals'
import { normalizePagination } from '@/lib/pagination'
import { prisma } from '@/lib/prisma'

interface QuotationFilters {
  page?: number
  pageSize?: number
  status?: string
  clientId?: string
}

export class QuotationService {
  static async getAllQuotations(filters: QuotationFilters = {}) {
    const {
      status,
      clientId,
    } = filters

    const { page, pageSize } = normalizePagination(filters.page, filters.pageSize ?? 10)
    const where: any = {}

    if (status && Object.values(DbQuotationStatus).includes(status as any)) {
      where.status = status
    }

    if (clientId) {
      where.clientId = clientId
    }

    const [quotations, total] = await Promise.all([
      prisma.quotation.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.quotation.count({ where }),
    ])

    return {
      quotations,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  static async getQuotationById(id: string) {
    return prisma.quotation.findUnique({
      where: { id },
      include: {
        client: true,
      },
    })
  }

  static async createQuotation(data: CreateQuotationInput) {
    return prisma.quotation.create({
      data: { ...data, ...calculateQuotationTotals(data), quotationNumber: `Q-${new Date().getFullYear()}-${randomUUID()}` },
      include: {
        client: true,
      },
    })
  }

  static async updateQuotation(id: string, data: UpdateQuotationInput) {
    return prisma.quotation.update({
      where: { id },
      data,
      include: {
        client: true,
      },
    })
  }

  static async deleteQuotation(id: string) {
    return prisma.quotation.delete({
      where: { id },
    })
  }

  static async updateQuotationStatus(id: string, status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED') {
    return prisma.quotation.update({
      where: { id },
      data: { status },
    })
  }
}
