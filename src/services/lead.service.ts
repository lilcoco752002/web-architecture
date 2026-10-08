import { LeadStatus as DbLeadStatus, ClientSource as DbClientSource } from '@prisma/client'
import { ClientService } from './client.service'
import { normalizePagination } from '@/lib/pagination'
import { prisma } from '@/lib/prisma'
import { CreateLeadInput } from '@/lib/validations'

interface LeadFilters {
  page?: number
  pageSize?: number
  status?: string
  source?: string
  search?: string
}

export class LeadService {
  static async getAllLeads(filters: LeadFilters = {}) {
    const {
      status,
      source,
      search,
    } = filters

    const { page, pageSize } = normalizePagination(filters.page, filters.pageSize ?? 10)
    const where: any = {}

    if (status && Object.values(DbLeadStatus).includes(status as any)) {
      where.status = status
    }

    if (source && Object.values(DbClientSource).includes(source as any)) {
      where.source = source
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ])

    return {
      data: leads,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  // Alias for consistency with other services
  static async listLeads(filters: LeadFilters = {}) {
    return this.getAllLeads(filters)
  }

  static async getLeadById(id: string) {
    return prisma.lead.findUnique({
      where: { id },
    })
  }

  static async createLead(data: CreateLeadInput, userId?: string) {
    const owner = userId ? { id: userId } : await prisma.user.findFirst({
      where: { role: 'ADMIN', status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    })
    if (!owner) throw new Error('No active administrator configured')
    return prisma.lead.create({
      data: { ...data, createdById: owner.id },
    })
  }

  static async updateLead(id: string, data: any) {
    return prisma.lead.update({
      where: { id },
      data,
    })
  }

  static async deleteLead(id: string) {
    return prisma.lead.delete({
      where: { id },
    })
  }

  static async convertLeadToClient(leadId: string, createdById: string) {
    return ClientService.convertLeadToClient(leadId, createdById)
  }
}
