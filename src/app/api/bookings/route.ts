export const dynamic = 'force-dynamic'

import { apiError } from '@/lib/api-error'
import { NextRequest, NextResponse } from 'next/server'
import { BookingService } from '@/services/booking.service'
import { createBookingSchema } from '@/lib/validations'

/**
 * POST /api/bookings
 * Create a new booking (public endpoint)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createBookingSchema.parse(body)
    
    const booking = await BookingService.createBooking(validatedData)

    // Here you would typically send an email notification
    // await sendBookingNotification(booking)

    return NextResponse.json(
      { 
        success: true,
        message: 'Booking submitted successfully',
        id: booking.id
      },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return apiError(error)
  }
}
