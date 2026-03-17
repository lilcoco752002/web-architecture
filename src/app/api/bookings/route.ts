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
        booking 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating booking:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create booking', message: error.message },
      { status: 500 }
    )
  }
}
