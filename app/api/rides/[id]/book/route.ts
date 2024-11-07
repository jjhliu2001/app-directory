import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    // Find the ride and check if seats are available
    const ride = await prisma.ride.findUnique({
      where: { id },
    })

    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 })
    }
    // Get current number of bookings
    const bookingsCount = await prisma.booking.count({
      where: { rideId: id },
    })

    if (bookingsCount >= ride.capacity) {
      return NextResponse.json({ error: 'No seats available' }, { status: 400 })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        rideId: id,
      },
    })

    return NextResponse.json({ booking, ride }, { status: 200 })
  } catch (error) {
    console.error('Error booking ride:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
