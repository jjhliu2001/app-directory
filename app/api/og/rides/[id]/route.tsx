import { ImageResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'edge'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const ride = await prisma.ride.findUnique({
            where: { id: params.id },
            include: { bookings: true },
        })

        if (!ride) {
            return new Response('Ride not found', { status: 404 })
        }

        const seatsRemaining = ride.capacity - ride.bookings.length

        return new ImageResponse(
            (
                <div
                    style={{
                        background: 'white',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                    }}
                >
                    <h1 style={{ fontSize: 60, color: '#1a365d' }}>
                        Ride to {ride.destination}
                    </h1>
                    <div style={{ fontSize: 40, color: '#2b6cb0', marginTop: 20 }}>
                        {seatsRemaining} seats available
                    </div>
                    <div style={{ fontSize: 30, color: '#4a5568', marginTop: 20 }}>
                        From: {ride.meetingPoint}
                    </div>
                    <div style={{ fontSize: 30, color: '#4a5568', marginTop: 10 }}>
                        Departing: {new Date(Number(ride.departureTimeMs)).toLocaleString()}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        )
    } catch (e) {
        return new Response(`Failed to generate image`, { status: 500 })
    }
} 