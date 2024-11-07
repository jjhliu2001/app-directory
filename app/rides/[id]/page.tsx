'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Ride } from '@prisma/client'

export default function RidePage() {
  const params = useParams()
  const router = useRouter()
  const [ride, setRide] = useState<Ride | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingInProgress, setBookingInProgress] = useState(false)

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await fetch(`/api/rides/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch ride details')
        }
        const data = await response.json()
        setRide(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchRide()
  }, [params.id])

  const handleBookRide = async () => {
    if (!ride) return

    setBookingInProgress(true)
    try {
      const response = await fetch(`/api/rides/${params.id}/book`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to book ride')
      }

      // Refresh the ride data to get updated seats
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book ride')
    } finally {
      setBookingInProgress(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  if (!ride) {
    return <div className="p-8 text-center">Ride not found</div>
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Ride Details</h1>

      <div className="space-y-4 rounded-lg bg-white p-6 shadow">
        <div>
          <h2 className="text-sm font-medium text-gray-500">Meeting Point</h2>
          <p className="mt-1">{ride.meetingPoint}</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500">Destination</h2>
          <p className="mt-1">{ride.destination}</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500">Departure Time</h2>
          <p className="mt-1">
            {new Date(ride.departureTime).toLocaleString()}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500">Seats Available</h2>
          <p className="mt-1">{ride.seatsAvailable}</p>
        </div>

        {ride.message && (
          <div>
            <h2 className="text-sm font-medium text-gray-500">Message</h2>
            <p className="mt-1">{ride.message}</p>
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={handleBookRide}
            disabled={bookingInProgress || ride.seatsAvailable < 1}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {bookingInProgress
              ? 'Booking...'
              : ride.seatsAvailable < 1
                ? 'No Seats Available'
                : 'Book This Ride'}
          </button>
        </div>
      </div>
    </main>
  )
}
