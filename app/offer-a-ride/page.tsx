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
  phoneNumber: string
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
      phoneNumber: '',
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
    <Container maxW="2xl" py={6}>
      <Heading as="h1" size="xl" mb={6}>
        Offer a Ride
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel htmlFor="meetingPoint">Meeting Point</FormLabel>
            <Input
              id="meetingPoint"
              {...register('meetingPoint', { required: true })}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="destination">Destination</FormLabel>
            <Input
              id="destination"
              {...register('destination', { required: true })}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="departureTime">Departure Time</FormLabel>
            <Input
              type="datetime-local"
              id="departureTime"
              {...register('departureTime', { required: true })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Seats Available</FormLabel>
            <HStack spacing={4}>
              {[1, 2, 3, 4].map((seats) => (
                <IconButton
                  key={seats}
                  aria-label={`${seats} seats`}
                  icon={
                    <HStack spacing={1}>
                      {[...Array(seats)].map((_, i) => (
                        <FaUser key={i} />
                      ))}
                    </HStack>
                  }
                  onClick={() => setValue('capacity', seats)}
                  colorScheme={capacity === seats ? 'blue' : 'gray'}
                  variant={capacity === seats ? 'solid' : 'outline'}
                  size="lg"
                  p={6}
                />
              ))}
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
            <Input
              type="tel"
              id="phoneNumber"
              {...register('phoneNumber', {
                required: true,
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Please enter a 10-digit phone number',
                },
              })}
              placeholder="1234567890"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="message">Message for Riders</FormLabel>
            <Textarea
              id="message"
              {...register('message')}
              height="32"
              placeholder="Add any additional information for potential riders..."
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="lg">
            Offer Ride
          </Button>
        </Stack>
      </form>
    </Container>
  )
}
