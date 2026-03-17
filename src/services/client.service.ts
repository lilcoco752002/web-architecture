import prisma from '@/lib/prisma'
import { CreateClientInput, UpdateClientInput } from '@/lib/validations'
import type { ClientStatus, ClientSource } from '@/types/prisma'
import { ActivityLogService } from '@/services/activity-log.service'

export class ClientService {
  /**
   * Create a new client
   */
  static async createClient(data: CreateClientInput, userId: string) {
    const client = await prisma.client.create({
      data: {
        ...data,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Log activity
    await ActivityLogService.log({
      type: 'CLIENT_CREATED',
      description: `Client "${client.name}" was created`,
      userId,
      clientId: client.id,
      entityType: 'Client',
      entityId: client.id,
    })

    return client
  }

  /**
   * Get client by ID
   */
  static async getClientById(id: string) {
    return prisma.client.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        projects: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        quotations: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })
  }

  /**
   * List clients with filters
   */
  static async listClients(params?: {
    status?: ClientStatus
    source?: ClientSource
    search?: string
    page?: number
    pageSize?: number
  }) {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const skip = (page - 1) * pageSize

    const where: any = {}

    if (params?.status) {
      where.status = params.status
    }

    if (params?.source) {
      where.source = params.source
    }

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { company: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
            },
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

    return {
      data: clients,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  /**
   * Update client
   */
  static async updateClient(id: string, data: UpdateClientInput, userId: string) {
    const oldClient = await prisma.client.findUnique({ where: { id } })

    const client = await prisma.client.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Log status change
    if (oldClient && oldClient.status !== client.status) {
      await ActivityLogService.log({
        type: 'CLIENT_STATUS_CHANGED',
        description: `Client status changed from ${oldClient.status} to ${client.status}`,
        userId,
        clientId: client.id,
        entityType: 'Client',
        entityId: client.id,
        metadata: {
          oldStatus: oldClient.status,
          newStatus: client.status,
        },
      })
    }

    return client
  }

  /**
   * Delete client
   */
  static async deleteClient(id: string) {
    return prisma.client.delete({
      where: { id },
    })
  }

  /**
   * Add note to client
   */
  static async addNote(clientId: string, content: string, isPrivate: boolean = false) {
    return prisma.clientNote.create({
      data: {
        clientId,
        content,
        isPrivate,
      },
    })
  }

  /**
   * Get client statistics
   */
  static async getClientStats() {
    const [total, byStatus, bySource, recentClients] = await Promise.all([
      prisma.client.count(),
      prisma.client.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.client.groupBy({
        by: ['source'],
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
      byStatus,
      bySource,
      recentClients,
    }
  }

  /**
   * Convert lead to client
   */
  static async convertLeadToClient(leadId: string, userId: string) {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    })

    if (!lead) {
      throw new Error('Lead not found')
    }

    if (lead.status === 'CONVERTED') {
      throw new Error('Lead already converted')
    }

    // Create client from lead
    const client = await prisma.client.create({
      data: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        website: lead.website,
        source: lead.source,
        status: 'NEW',
        priority: lead.priority,
        createdById: userId,
        convertedAt: new Date(),
      },
    })

    // Update lead status
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'CONVERTED',
        convertedAt: new Date(),
        convertedToClientId: client.id,
      },
    })

    // Log activity
    await ActivityLogService.log({
      type: 'LEAD_CONVERTED',
      description: `Lead "${lead.name}" converted to client`,
      userId,
      leadId,
      clientId: client.id,
      entityType: 'Lead',
      entityId: leadId,
    })

    return client
  }
}
