import { Metadata, ResolvingMetadata } from 'next'
import { prisma } from '@/lib/prisma'

export async function generateMetadata(
    { params }: { params: { id: string } },
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Fetch ride data
    const ride = await prisma.ride.findUnique({
        where: { id: params.id },
        include: { bookings: true },
    })

    if (!ride) {
        return {
            title: 'Ride Not Found',
        }
    }

    const seatsRemaining = ride.capacity - ride.bookings.length

    return {
        title: `Ride to ${ride.destination}`,
        description: `${seatsRemaining} seats available - From ${ride.meetingPoint} to ${ride.destination}. Departing ${new Date(Number(ride.departureTimeMs)).toLocaleString()}`,
        openGraph: {
            title: `Ride to ${ride.destination}`,
            description: `${seatsRemaining} seats available - From ${ride.meetingPoint} to ${ride.destination}. Departing ${new Date(Number(ride.departureTimeMs)).toLocaleString()}`,
            type: 'website',
            images: [
                {
                    url: `/api/og/rides/${params.id}`,
                    width: 1200,
                    height: 630,
                    alt: `Ride to ${ride.destination}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Ride to ${ride.destination}`,
            description: `${seatsRemaining} seats available - From ${ride.meetingPoint} to ${ride.destination}`,
        },
    }
}

export default function RideLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 