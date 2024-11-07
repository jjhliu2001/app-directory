'use client'

import { useForm } from 'react-hook-form'
import { FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

type FormData = {
  meetingPoint: string
  destination: string
  departureTime: string
  capacity: number
  message: string
}

export default function OfferRidePage() {
  const router = useRouter()
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      meetingPoint: '',
      destination: '',
      departureTime: '',
      capacity: 1,
      message: '',
    },
  })

  const capacity = watch('capacity')

  const onSubmit = async (data: FormData) => {
    try {
      // Convert datetime-local string to epoch seconds
      const departureTimeEpoch = new Date(data.departureTime).valueOf()

      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          departureTimeMs: departureTimeEpoch,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create ride')
      }

      const ride = await response.json()
      console.log('Ride created:', ride)

      // Redirect to the ride details page
      router.push(`/rides/${ride.id}`)
    } catch (error) {
      console.error('Error creating ride:', error)
      // TODO: Show error message to user
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Offer a Ride</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="meetingPoint" className="mb-1 block">
            Meeting Point
          </label>
          <input
            type="text"
            id="meetingPoint"
            {...register('meetingPoint', { required: true })}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label htmlFor="destination" className="mb-1 block">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            {...register('destination', { required: true })}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label htmlFor="departureTime" className="mb-1 block">
            Departure Time
          </label>
          <input
            type="datetime-local"
            id="departureTime"
            {...register('departureTime', { required: true })}
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block">Seats Available</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((seats) => (
              <button
                key={seats}
                type="button"
                onClick={() => setValue('capacity', seats)}
                className={`flex items-center justify-center rounded-lg border p-3 ${
                  capacity === seats
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-500'
                }`}
              >
                <div className="flex items-center">
                  {[...Array(seats)].map((_, i) => (
                    <FaUser key={i} className="mx-0.5" />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1 block">
            Message for Riders
          </label>
          <textarea
            id="message"
            {...register('message')}
            className="h-32 w-full rounded border p-2"
            placeholder="Add any additional information for potential riders..."
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Offer Ride
        </button>
      </form>
    </main>
  )
}
