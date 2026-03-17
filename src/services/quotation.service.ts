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
      page = 1,
      pageSize = 10,
      status,
      clientId,
    } = filters

    const where: any = {}

    if (status) {
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

  static async createQuotation(data: any) {
    return prisma.quotation.create({
      data,
      include: {
        client: true,
      },
    })
  }

  static async updateQuotation(id: string, data: any) {
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
