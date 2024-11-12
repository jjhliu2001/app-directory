import { ImageResponse } from 'next/og'

export const runtime = 'edge'

type RouteSegment = {
    params: {
        id: string
    }
}

export async function GET(
    request: Request,
    context: RouteSegment
): Promise<ImageResponse> {
    const { id } = context.params

    // You'll need to add code here to fetch the ride data
    const ride = await getRide(id)
    const seatsRemaining = ride.seatsRemaining

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
} 