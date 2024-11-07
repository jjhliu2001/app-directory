"use client";

import { useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";

type FormData = {
  meetingPoint: string;
  destination: string;
  departureTime: string;
  seatsAvailable: number;
  message: string;
};

export default function OfferRidePage() {
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      meetingPoint: "",
      destination: "",
      departureTime: "",
      seatsAvailable: 1,
      message: "",
    },
  });

  const seatsAvailable = watch("seatsAvailable");

  const onSubmit = async (data: FormData) => {
    // TODO: Handle form submission
    console.log(data);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Offer a Ride</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="meetingPoint" className="block mb-1">
            Meeting Point
          </label>
          <input
            type="text"
            id="meetingPoint"
            {...register("meetingPoint", { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="destination" className="block mb-1">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            {...register("destination", { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="departureTime" className="block mb-1">
            Departure Time
          </label>
          <input
            type="datetime-local"
            id="departureTime"
            {...register("departureTime", { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Seats Available</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((seats) => (
              <button
                key={seats}
                type="button"
                onClick={() => setValue("seatsAvailable", seats)}
                className={`flex items-center justify-center p-3 border rounded-lg ${
                  seatsAvailable === seats
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
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
          <label htmlFor="message" className="block mb-1">
            Message for Riders
          </label>
          <textarea
            id="message"
            {...register("message")}
            className="w-full p-2 border rounded h-32"
            placeholder="Add any additional information for potential riders..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Offer Ride
        </button>
      </form>
    </main>
  );
}
