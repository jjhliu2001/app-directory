export type Ride = {
  id: string;
  meetingPoint: string;
  destination: string;
  departureTime: string;
  seatsAvailable: number;
  message?: string;
  createdAt: string;
  userId: string; // We'll need this when we add authentication
};
