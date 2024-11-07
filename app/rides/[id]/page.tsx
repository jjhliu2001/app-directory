'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Ride, Booking } from '@prisma/client'

export default function RidePage() {
  const params = useParams()
  const router = useRouter()
  const [ride, setRide] = useState<(Ride & { bookings: Booking[] }) | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingInProgress, setBookingInProgress] = useState(false)
  const [showPhoneForm, setShowPhoneForm] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      })

      if (!response.ok) {
        throw new Error('Failed to book ride')
      }

      // Reset form and hide it
      setShowPhoneForm(false)
      setPhoneNumber('')

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

  const seatsRemaining = ride.capacity - (ride.bookings?.length || 0)

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
          <h2 className="text-sm font-medium text-gray-500">Seats</h2>
          <p className="mt-1">
            {seatsRemaining} available out of {ride.capacity} total
          </p>
        </div>

        {ride.message && (
          <div>
            <h2 className="text-sm font-medium text-gray-500">Message</h2>
            <p className="mt-1">{ride.message}</p>
          </div>
        )}

        <div>
          <h2 className="text-sm font-medium text-gray-500">
            Current Bookings
          </h2>
          {ride.bookings && ride.bookings.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {ride.bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <span>📱 {booking.userPhoneNumber}</span>
                  <span className="text-sm text-gray-500">
                    Booked {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-gray-500">No bookings yet</p>
          )}
        </div>

        <div className="pt-4">
          {showPhoneForm ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="1234567890"
                  className="w-full rounded border p-2"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleBookRide}
                  disabled={bookingInProgress || !phoneNumber.match(/^\d{10}$/)}
                  className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {bookingInProgress ? 'Booking...' : 'Book'}
                </button>
                <button
                  onClick={() => setShowPhoneForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPhoneForm(true)}
              disabled={seatsRemaining < 1}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {seatsRemaining < 1 ? 'No Seats Available' : 'Book This Ride'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
