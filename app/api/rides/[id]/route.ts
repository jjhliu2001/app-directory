import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextApiRequest, response: NextApiResponse) {
  const { id } = request.query as { id: string }

  try {
    const ride = await prisma.ride.findUnique({
      where: { id },
    })

    if (!ride) {
      return response.status(404).json({ error: 'Ride not found' })
    }

    return response.status(200).json(ride)
  } catch (error) {
    console.error('Error fetching ride:', error)
    return response.status(500).json({ error: 'Internal server error' })
  }
}
