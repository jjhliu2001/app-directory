'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Ride, Booking } from '@prisma/client'
import dayjs from 'dayjs'
import { FaArrowDown } from 'react-icons/fa'

export default function RidePage() {
  const params = useParams()
  const router = useRouter()
  const [ride, setRide] = useState<(Ride & { bookings: Booking[] }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingInProgress, setBookingInProgress] = useState(false)
  const [bookingName, setBookingName] = useState('')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    type: 'success' | 'error';
  } | null>(null)

  const fetchRide = useCallback(async () => {
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
  }, [params.id])

  useEffect(() => {
    fetchRide()
  }, [fetchRide])

  const handleBookRide = async () => {
    if (!ride || !bookingName.trim()) return

    setBookingInProgress(true)
    try {
      const response = await fetch(`/api/rides/${params.id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: bookingName.trim() })
      })

      if (!response.ok) {
        throw new Error('Failed to book ride')
      }

      await fetchRide()
      setShowBookingForm(false)
      setBookingName('')
      setToastMessage({ title: 'Ride booked successfully', type: 'success' })
    } catch (err) {
      setToastMessage({
        title: err instanceof Error ? err.message : 'Failed to book ride',
        type: 'error'
      })
    } finally {
      setBookingInProgress(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="p-8 text-center">
        Ride not found
      </div>
    )
  }

  const seatsRemaining = ride.capacity - (ride.bookings?.length || 0)

  return (
    <div className="container mx-auto max-w-2xl py-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col gap-4 items-center justify-center">
            <span className="text-lg font-bold">
              {ride.meetingPoint}
            </span>
            <FaArrowDown className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-bold">
              {ride.destination}
            </span>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">
              Departing at
            </span>
            <p className="mt-1">
              {dayjs(Number(ride.departureTimeMs)).format('DD MMM h:mm A')}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">
              Driver
            </span>
            <p className="mt-1">{ride.fullName}</p>
          </div>

          {ride.message && (
            <div>
              <span className="text-sm font-medium text-gray-500">
                Message
              </span>
              <p className="mt-1">{ride.message}</p>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Current Bookings
              </span>
              <span className={`text-sm font-medium ${seatsRemaining > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                {seatsRemaining} of {ride.capacity} seats available
              </span>
            </div>
            {ride.bookings && ride.bookings.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {ride.bookings.map((booking) => (
                  <li
                    key={booking.id}
                    className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
                  >
                    <span>{booking.fullName}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-gray-500">
                No bookings yet
              </p>
            )}
          </div>

          <div className="pt-4">
            {!showBookingForm ? (
              <button
                onClick={() => setShowBookingForm(true)}
                disabled={seatsRemaining < 1}
                className={`w-full py-2 px-4 rounded-md ${seatsRemaining < 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {seatsRemaining < 1 ? 'No Seats Available' : 'Book This Ride'}
              </button>
            ) : (
              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Your Full Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="w-1/2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookRide}
                    disabled={bookingInProgress || !bookingName.trim()}
                    className={`w-1/2 py-2 px-4 rounded-md ${bookingInProgress || !bookingName.trim()
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                  >
                    {bookingInProgress ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
          {toastMessage.title}
        </div>
      )}
    </div>
  )
}
