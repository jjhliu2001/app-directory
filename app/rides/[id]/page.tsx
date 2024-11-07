"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Ride } from "@prisma/client";

export default function RidePage() {
  const params = useParams();
  const router = useRouter();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await fetch(`/api/rides/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch ride details");
        }
        const data = await response.json();
        setRide(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [params.id]);

  const handleBookRide = async () => {
    if (!ride) return;

    setBookingInProgress(true);
    try {
      const response = await fetch(`/api/rides/${params.id}/book`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to book ride");
      }

      // Refresh the ride data to get updated seats
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book ride");
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  if (!ride) {
    return <div className="text-center p-8">Ride not found</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ride Details</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
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
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {bookingInProgress
              ? "Booking..."
              : ride.seatsAvailable < 1
                ? "No Seats Available"
                : "Book This Ride"}
          </button>
        </div>
      </div>
    </main>
  );
}
