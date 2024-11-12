'use client'

import { useEffect, useState, useCallback } from 'react'
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
  const [bookingName, setBookingName] = useState('')
  const [showBookingForm, setShowBookingForm] = useState(false)

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
              Driver
            </Text>
            <Text mt={1}>{ride.fullName}</Text>
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
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                Current Bookings
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={seatsRemaining > 0 ? 'green.500' : 'red.500'}
              >
                {seatsRemaining} of {ride.capacity} seats available
              </Text>
            </Flex>
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
                    <Text>{booking.fullName}</Text>
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
            {!showBookingForm ? (
              <Button
                onClick={() => setShowBookingForm(true)}
                isDisabled={seatsRemaining < 1}
                colorScheme="blue"
                width="100%"
              >
                {seatsRemaining < 1 ? 'No Seats Available' : 'Book This Ride'}
              </Button>
            ) : (
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Your Full Name</FormLabel>
                  <Input
                    placeholder="Enter your full name"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                  />
                </FormControl>
                <HStack width="100%">
                  <Button
                    onClick={() => setShowBookingForm(false)}
                    variant="outline"
                    width="50%"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBookRide}
                    isLoading={bookingInProgress}
                    isDisabled={!bookingName.trim()}
                    colorScheme="blue"
                    width="50%"
                  >
                    Confirm Booking
                  </Button>
                </HStack>
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>
    </Container>
  )
}
