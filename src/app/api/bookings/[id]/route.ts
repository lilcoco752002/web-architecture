export const dynamic = 'force-dynamic'

import { updateBookingSchema } from '@/lib/validations'
import { apiError } from '@/lib/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BookingService } from '@/services/booking.service'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booking = await BookingService.getBookingById(params.id)

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const booking = await BookingService.updateBooking(params.id, updateBookingSchema.parse(body), session.user.id)

    return NextResponse.json(booking)
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await BookingService.deleteBooking(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}
