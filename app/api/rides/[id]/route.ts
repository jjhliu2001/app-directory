import { NextRequest, NextResponse } from "next/server";
import { prisma } from "#/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const ride = await prisma.ride.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    return NextResponse.json(ride);
  } catch (error) {
    console.error("Error fetching ride:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
