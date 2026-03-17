import { prisma } from '@/lib/prisma'

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
      page = 1,
      pageSize = 10,
      status,
      source,
      search,
    } = filters

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (source) {
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

  static async createLead(data: any) {
    return prisma.lead.create({
      data,
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
    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) throw new Error('Lead not found')

    const client = await prisma.client.create({
      data: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        source: lead.source,
        createdById,
      },
    })

    await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'CONVERTED' },
    })

    return client
  }
}
