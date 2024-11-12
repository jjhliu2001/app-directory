import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['meetingPoint', 'destination', 'departureTimeMs', 'capacity', 'fullName']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Convert departureTimeMs to BigInt
    const departureTimeMs = BigInt(body.departureTimeMs)

    if (typeof body.capacity !== 'number' || body.capacity < 1) {
      return NextResponse.json(
        { message: 'capacity must be a positive number' },
        { status: 400 }
      )
    }

    const ride = await prisma.ride.create({
      data: {
        meetingPoint: body.meetingPoint,
        destination: body.destination,
        departureTimeMs, // Now it's a BigInt
        capacity: body.capacity,
        message: body.message || '',
        fullName: body.fullName,
      },
    })

    // Convert BigInt to string for JSON serialization
    return NextResponse.json({
      ...ride,
      departureTimeMs: ride.departureTimeMs.toString()
    }, { status: 201 })

  } catch (error) {
    console.error('Error processing ride:', error)
    return NextResponse.json(
      { message: `Error creating ride: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }  // Changed to 500 for server errors
    )
  }
}
