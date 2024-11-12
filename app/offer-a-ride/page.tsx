'use client'

import { useForm } from 'react-hook-form'
import { FaUser } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  HStack,
  IconButton,
} from '@chakra-ui/react'

type FormData = {
  meetingPoint: string
  destination: string
  departureTime: string
  capacity: number
  message: string
  fullName: string
}

export default function OfferRidePage() {
  const router = useRouter()
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      meetingPoint: '',
      destination: '',
      departureTime: '',
      capacity: 1,
      message: '',
      fullName: '',
    },
  })

  const capacity = watch('capacity')

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted with data:', data)
    try {
      const departureTime = new Date(data.departureTime)
      if (isNaN(departureTime.valueOf())) {
        throw new Error('Invalid departure time')
      }

      const departureTimeEpoch = departureTime.valueOf()

      const payload = {
        ...data,
        departureTimeMs: departureTimeEpoch,
      }
      console.log('Sending payload:', payload)

      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to create ride: ${response.status}`)
      }

      console.log('Ride created successfully:', responseData)
      router.push(`/rides/${responseData.id}`)
    } catch (error) {
      console.error('Error creating ride:', error)
      // You might want to add an error state here
      // setError(error.message)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Offer a Ride</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="destination" className="block font-medium">
            Destination
            <span className="text-sm text-gray-500 ml-2">Where are you heading to?</span>
          </label>
          <input
            id="destination"
            className="w-full p-2 border rounded-md"
            {...register('destination', {
              required: 'Destination is required',
              minLength: { value: 2, message: 'Destination must be at least 2 characters' }
            })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="meetingPoint" className="block font-medium">
            Meeting Point
            <span className="text-sm text-gray-500 ml-2">Where should your passengers meet you?</span>
          </label>
          <input
            id="meetingPoint"
            className="w-full p-2 border rounded-md"
            {...register('meetingPoint', { required: true })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="departureTime" className="block font-medium">Departure Time</label>
          <input
            type="datetime-local"
            id="departureTime"
            className="w-full p-2 border rounded-md"
            {...register('departureTime', { required: true })}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">
            Seats Available
            <span className="text-sm text-gray-500 ml-2">How many passengers can you take?</span>
          </label>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((seats) => (
              <button
                key={seats}
                type="button"
                onClick={() => setValue('capacity', seats)}
                className={`p-4 border rounded-md ${capacity === seats
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700'
                  }`}
              >
                <div className="flex gap-1">
                  {Array.from({ length: seats }).map((_, i) => (
                    <FaUser key={i} />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="fullName" className="block font-medium">
            Full Name
            <span className="text-sm text-gray-500 ml-2">Let passengers know who you are</span>
          </label>
          <input
            type="text"
            id="fullName"
            className="w-full p-2 border rounded-md"
            placeholder="John Doe"
            {...register('fullName', {
              required: true,
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters long',
              },
            })}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block font-medium">
            Additional Information for Riders
          </label>
          <textarea
            id="message"
            className="w-full p-2 border rounded-md h-32"
            placeholder="e.g. I won't wait more than 5 minutes"
            {...register('message')}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600"
        >
          Offer Ride
        </button>
      </form>
    </div>
  )
}