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
          phoneNumber: data.phoneNumber.replace(/\D/g, ''), // Strip non-numeric characters
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
            <FormLabel htmlFor="destination">
              Destination
              <Box as="span" fontSize="sm" color="gray.500" ml={2}>
                Where are you heading to?
              </Box>
            </FormLabel>
            <Input
              id="destination"
              {...register('destination', { required: true })}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="meetingPoint">
              Meeting Point
              <Box as="span" fontSize="sm" color="gray.500" ml={2}>
                Where should your passengers meet you?
              </Box>
            </FormLabel>
            <Input
              id="meetingPoint"
              {...register('meetingPoint', { required: true })}
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
            <FormLabel>
              Seats Available
              <Box as="span" fontSize="sm" color="gray.500" ml={2}>
                How many passengers can you take?
              </Box>
            </FormLabel>
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
            <FormLabel htmlFor="phoneNumber">
              Phone Number
              <Box as="span" fontSize="sm" color="gray.500" ml={2}>
                Passengers may choose to text/call you
              </Box>
            </FormLabel>
            <Input
              type="tel"
              id="phoneNumber"
              {...register('phoneNumber', {
                required: true,
                setValueAs: (value) => {
                  // Remove all non-digits
                  const cleaned = value.replace(/\D/g, '')
                  // Format as (XXX) XXX-XXXX
                  if (cleaned.length >= 10) {
                    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
                  }
                  return cleaned
                },
                pattern: {
                  value: /^\(\d{3}\) \d{3}-\d{4}$/,
                  message: 'Please enter a valid phone number',
                },
              })}
              placeholder="(215) 812-3456"
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="message">
              Additional Information for Riders
            </FormLabel>
            <Textarea
              id="message"
              {...register('message')}
              height="32"
              placeholder="e.g. I won't wait more than 5 minutes"
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
