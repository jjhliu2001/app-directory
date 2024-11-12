export async function fetchRideData() {
    try {
        const response = await fetch('/api/rides')
        if (!response.ok) {
            throw new Error('Failed to fetch ride data')
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching ride data:', error)
        return null
    }
} 