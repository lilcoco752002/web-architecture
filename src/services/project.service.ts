import prisma from '@/lib/prisma'
import { CreateProjectInput, UpdateProjectInput } from '@/lib/validations'
import { generateSlug } from '@/lib/helpers'
import type { ProjectStatus } from '@/types/prisma'
import { ActivityLogService } from './activity-log.service'

export class ProjectService {
  /**
   * Create a new project
   */
  static async createProject(data: CreateProjectInput, userId: string) {
    const { serviceIds, ...projectData } = data

    // Get client name
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
      select: { name: true },
    })

    if (!client) {
      throw new Error('Client not found')
    }

    // Generate unique slug
    const slug = generateSlug(data.title)

    const project = await prisma.project.create({
      data: {
        ...projectData,
        slug,
        clientName: client.name,
        createdById: userId,
        services: {
          create: serviceIds?.map((serviceId) => ({
            serviceId,
          })),
        },
      },
      include: {
        client: true,
        services: {
          include: {
            service: true,
          },
        },
        images: true,
      },
    })

    // Log activity
    await ActivityLogService.log({
      type: 'PROJECT_CREATED',
      description: `Project "${project.title}" was created`,
      userId,
      projectId: project.id,
      clientId: project.clientId,
      entityType: 'Project',
      entityId: project.id,
    })

    return project
  }

  /**
   * Get project by ID
   */
  static async getProjectById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        testimonial: true,
      },
    })
  }

  /**
   * Get project by slug
   */
  static async getProjectBySlug(slug: string) {
    return prisma.project.findUnique({
      where: { slug },
      include: {
        services: {
          include: {
            service: true,
          },
        },
        images: {
          orderBy: { order: 'asc' },
        },
        testimonial: true,
      },
    })
  }

  /**
   * List projects with filters
   */
  static async listProjects(params?: {
    status?: ProjectStatus
    clientId?: string
    published?: boolean
    featured?: boolean
    search?: string
    page?: number
    pageSize?: number
  }) {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const skip = (page - 1) * pageSize

    const where: any = {}

    if (params?.status) where.status = params.status
    if (params?.clientId) where.clientId = params.clientId
    if (params?.published !== undefined) where.published = params.published
    if (params?.featured !== undefined) where.featured = params.featured

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { clientName: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              company: true,
            },
          },
          services: {
            include: {
              service: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              images: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.project.count({ where }),
    ])

    return {
      data: projects,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  /**
   * Update project
   */
  static async updateProject(id: string, data: UpdateProjectInput, userId: string) {
    const { serviceIds, ...projectData } = data

    const oldProject = await prisma.project.findUnique({ where: { id } })

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        ...(serviceIds && {
          services: {
            deleteMany: {},
            create: serviceIds.map((serviceId) => ({
              serviceId,
            })),
          },
        }),
      },
      include: {
        client: true,
        services: {
          include: {
            service: true,
          },
        },
        images: true,
      },
    })

    // Log status change
    if (oldProject && oldProject.status !== project.status) {
      await ActivityLogService.log({
        type: 'PROJECT_STATUS_CHANGED',
        description: `Project status changed from ${oldProject.status} to ${project.status}`,
        userId,
        projectId: project.id,
        clientId: project.clientId,
        entityType: 'Project',
        entityId: project.id,
      })
    }

    return project
  }

  /**
   * Delete project
   */
  static async deleteProject(id: string) {
    return prisma.project.delete({
      where: { id },
    })
  }

  /**
   * Add images to project
   */
  static async addImages(projectId: string, images: Array<{ url: string; altText?: string; caption?: string; order: number }>) {
    return prisma.projectImage.createMany({
      data: images.map((img) => ({
        ...img,
        projectId,
      })),
    })
  }

  /**
   * Get featured projects
   */
  static async getFeaturedProjects(limit: number = 6) {
    return prisma.project.findMany({
      where: {
        published: true,
        featured: true,
      },
      include: {
        services: {
          include: {
            service: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        images: {
          take: 1,
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  /**
   * Get project statistics
   */
  static async getProjectStats() {
    const [total, byStatus, byType, completedThisMonth] = await Promise.all([
      prisma.project.count(),
      prisma.project.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.project.groupBy({
        by: ['type'],
        _count: true,
      }),
      prisma.project.count({
        where: {
          status: 'COMPLETED',
          endDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ])

    return {
      total,
      byStatus,
      byType,
      completedThisMonth,
    }
  }
}
