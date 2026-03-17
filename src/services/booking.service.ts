import prisma from '@/lib/prisma'
import { CreateBookingInput, UpdateBookingInput } from '@/lib/validations'
import type { BookingStatus } from '@/types/prisma'
import { ActivityLogService } from './activity-log.service'

export class BookingService {
  /**
   * Create a new booking
   */
  static async createBooking(data: CreateBookingInput) {
    // Check if client exists
    let client = await prisma.client.findUnique({
      where: { email: data.email },
    })

    const booking = await prisma.booking.create({
      data: {
        ...data,
        clientId: client?.id,
      },
    })

    // Log activity if client exists
    if (client) {
      await ActivityLogService.log({
        type: 'BOOKING_CREATED',
        description: `New booking received from ${data.name}`,
        userId: client.createdById,
        clientId: client.id,
        entityType: 'Booking',
        entityId: booking.id,
      })
    }

    return booking
  }

  /**
   * Get booking by ID
   */
  static async getBookingById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
          },
        },
      },
    })
  }

  /**
   * List bookings with filters
   */
  static async listBookings(params?: {
    status?: BookingStatus
    clientId?: string
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

    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { company: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              company: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.booking.count({ where }),
    ])

    return {
      data: bookings,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  /**
   * Update booking
   */
  static async updateBooking(id: string, data: UpdateBookingInput, userId: string) {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...data,
        reviewedAt: data.status !== 'PENDING' ? new Date() : undefined,
        reviewedBy: data.status !== 'PENDING' ? userId : undefined,
      },
    })

    // Log activity
    await ActivityLogService.log({
      type: 'BOOKING_UPDATED',
      description: `Booking status updated to ${data.status}`,
      userId,
      entityType: 'Booking',
      entityId: booking.id,
      clientId: booking.clientId || undefined,
    })

    return booking
  }

  /**
   * Delete booking
   */
  static async deleteBooking(id: string) {
    return prisma.booking.delete({
      where: { id },
    })
  }

  /**
   * Get booking statistics
   */
  static async getBookingStats() {
    const [total, byStatus, pending, thisMonth] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.groupBy({
        by: ['status'],
        _count: true,
      }),
      prisma.booking.count({
        where: { status: 'PENDING' },
      }),
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ])

    return {
      total,
      byStatus,
      pending,
      thisMonth,
    }
  }
}
