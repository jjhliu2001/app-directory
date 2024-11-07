'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Ride, Booking } from '@prisma/client'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  List,
  ListItem,
  Stack,
  Text,
  VStack,
  useToast,
  HStack,
  Icon,
  Flex,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { FaArrowDown, FaArrowRight } from 'react-icons/fa'

export default function RidePage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
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

      setShowPhoneForm(false)
      setPhoneNumber('')
      router.refresh()

      toast({
        title: 'Ride booked successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to book ride',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setBookingInProgress(false)
    }
  }

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        Loading...
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={8} textAlign="center" color="red.500">
        {error}
      </Box>
    )
  }

  if (!ride) {
    return (
      <Box p={8} textAlign="center">
        Ride not found
      </Box>
    )
  }

  const seatsRemaining = ride.capacity - (ride.bookings?.length || 0)

  return (
    <Container maxW="2xl" py={6}>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="base">
        <VStack spacing={4} align="stretch">
          <Flex flexDir="column" gap={4} align="center" justify="center">
            <Text fontSize="lg" fontWeight="bold">
              {ride.meetingPoint}
            </Text>
            <Icon as={FaArrowDown} w={6} h={6} color="blue.500" />
            <Text fontSize="lg" fontWeight="bold">
              {ride.destination}
            </Text>
          </Flex>

          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
              Departing at
            </Text>
            <Text mt={1}>
              {dayjs(ride.departureTime).format('DD MMM h:mm A')}
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
              Seats
            </Text>
            <Text mt={1}>
              {seatsRemaining} available out of {ride.capacity} total
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
              Driver&apos;s Phone Number
            </Text>
            <Text mt={1}>📱 {ride.userPhoneNumber}</Text>
          </Box>

          {ride.message && (
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                Message
              </Text>
              <Text mt={1}>{ride.message}</Text>
            </Box>
          )}

          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
              Current Bookings
            </Text>
            {ride.bookings && ride.bookings.length > 0 ? (
              <List spacing={2} mt={2}>
                {ride.bookings.map((booking) => (
                  <ListItem
                    key={booking.id}
                    p={3}
                    bg="gray.50"
                    borderRadius="lg"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text>📱 {booking.userPhoneNumber}</Text>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Text mt={1} color="gray.500">
                No bookings yet
              </Text>
            )}
          </Box>

          <Box pt={4}>
            {showPhoneForm ? (
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                  <Input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="1234567890"
                    pattern="[0-9]{10}"
                    required
                  />
                </FormControl>
                <Stack direction="row" spacing={2}>
                  <Button
                    onClick={handleBookRide}
                    isDisabled={
                      bookingInProgress || !phoneNumber.match(/^\d{10}$/)
                    }
                    colorScheme="blue"
                    flex={1}
                    isLoading={bookingInProgress}
                    loadingText="Booking..."
                  >
                    Book
                  </Button>
                  <Button
                    onClick={() => setShowPhoneForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Button
                onClick={() => setShowPhoneForm(true)}
                isDisabled={seatsRemaining < 1}
                colorScheme="blue"
                width="100%"
              >
                {seatsRemaining < 1 ? 'No Seats Available' : 'Book This Ride'}
              </Button>
            )}
          </Box>
        </VStack>
      </Box>
    </Container>
  )
}
