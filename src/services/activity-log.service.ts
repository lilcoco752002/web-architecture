import prisma from '@/lib/prisma'
import type { ActivityType } from '@/types/prisma'

interface LogActivityParams {
  type: ActivityType
  description: string
  userId: string
  metadata?: Record<string, any>
  entityType?: string
  entityId?: string
  clientId?: string
  leadId?: string
  projectId?: string
  ipAddress?: string
}

export class ActivityLogService {
  /**
   * Log an activity
   */
  static async log(params: LogActivityParams) {
    return prisma.activityLog.create({
      data: {
        type: params.type as any,
        description: params.description,
        userId: params.userId,
        metadata: params.metadata,
        entityType: params.entityType,
        entityId: params.entityId,
        clientId: params.clientId,
        leadId: params.leadId,
        projectId: params.projectId,
        ipAddress: params.ipAddress,
      },
    })
  }

  /**
   * Get activity logs with filters
   */
  static async getActivities(params?: {
    userId?: string
    entityType?: string
    entityId?: string
    clientId?: string
    leadId?: string
    projectId?: string
    type?: ActivityType
    page?: number
    pageSize?: number
  }) {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 50
    const skip = (page - 1) * pageSize

    const where: any = {}

    if (params?.userId) where.userId = params.userId
    if (params?.entityType) where.entityType = params.entityType
    if (params?.entityId) where.entityId = params.entityId
    if (params?.clientId) where.clientId = params.clientId
    if (params?.leadId) where.leadId = params.leadId
    if (params?.projectId) where.projectId = params.projectId
    if (params?.type) where.type = params.type

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.activityLog.count({ where }),
    ])

    return {
      data: activities,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  /**
   * Get recent activities
   */
  static async getRecentActivities(limit: number = 10) {
    return prisma.activityLog.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  /**
   * Get activity statistics
   */
  static async getActivityStats(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const activities = await prisma.activityLog.groupBy({
      by: ['type'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: true,
    })

    return activities
  }
}
