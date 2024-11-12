import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rideId = params.id
    const { fullName } = await request.json()

    if (!fullName?.trim()) {
      return NextResponse.json(
        { message: 'Full name is required' },
        { status: 400 }
      )
    }

    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: { bookings: true },
    })

    if (!ride) {
      return NextResponse.json(
        { message: 'Ride not found' },
        { status: 404 }
      )
    }

    const seatsRemaining = ride.capacity - ride.bookings.length
    if (seatsRemaining < 1) {
      return NextResponse.json(
        { message: 'No seats available' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        rideId,
        fullName: fullName.trim(),
        capacity: 1,
      },
    })

    return NextResponse.json(booking, { status: 201 })

  } catch (error) {
    console.error('Error booking ride:', error)
    return NextResponse.json(
      { message: 'Error booking ride' },
      { status: 500 }
    )
  }
}
