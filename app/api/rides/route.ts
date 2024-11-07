import { NextRequest, NextResponse } from "next/server";
import { prisma } from "#/lib/prisma";
import { z } from "zod"; // For input validation

// Input validation schema
const createRideSchema = z.object({
  meetingPoint: z.string().min(1, "Meeting point is required"),
  destination: z.string().min(1, "Destination is required"),
  departureTime: z.number().int().min(0, "Invalid departure time"),
  seatsAvailable: z.number().int().min(1, "Must offer at least 1 seat"),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = createRideSchema.parse(body);

    // Create ride in database
    const ride = await prisma.ride.create({
      data: {
        meetingPoint: validatedData.meetingPoint,
        destination: validatedData.destination,
        departureTime: new Date(validatedData.departureTime), // TODO use date library
        seatsAvailable: validatedData.seatsAvailable,
        message: validatedData.message,
        userId: "temp-user-id", // TODO: Get from auth session
      },
    });

    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    console.error("Error creating ride:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
