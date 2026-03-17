import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { RegisterInput } from '@/lib/validations'
import type { UserRole, UserStatus } from '@/types/prisma'

export class AuthService {
  /**
   * Create a new user
   */
  static async createUser(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    const hashedPassword = await hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: (data.role as UserRole) || 'STAFF',
        status: 'ACTIVE' as UserStatus,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })

    return user
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        phone: true,
        lastLoginAt: true,
        createdAt: true,
      },
    })
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        phone: true,
        lastLoginAt: true,
        createdAt: true,
      },
    })
  }

  /**
   * Update user
   */
  static async updateUser(id: string, data: Partial<RegisterInput>) {
    const updateData: any = { ...data }

    if (data.password) {
      updateData.password = await hash(data.password, 12)
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        phone: true,
      },
    })
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, newPassword: string) {
    const hashedPassword = await hash(newPassword, 12)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })
  }

  /**
   * List all users
   */
  static async listUsers(filters?: { role?: UserRole; status?: UserStatus }) {
    return prisma.user.findMany({
      where: {
        role: filters?.role,
        status: filters?.status,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Delete user
   */
  static async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  }
}
