export type Ride = {
  id: string
  meetingPoint: string
  destination: string
  departureTimeMs: number
  capacity: number
  message?: string
  createdAt: string
  userId: string // We'll need this when we add authentication
}
