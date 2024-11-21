'use client'

import { usePointMe } from '../../../lib/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Calendar,
  Clock,
  DollarSign,
  Star,
 // Users,
  //TrendingUp
} from 'lucide-react'

export default function BusinessDashboard(): JSX.Element {
  const { businesses, services, bookings, reviews, loading, error } = usePointMe()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const userBusiness = businesses[0] // Assuming one business per user for now
  if (!userBusiness) return <div>No business found</div>

  const businessServices = services.filter(s => s.business_id === userBusiness.id)
  const businessBookings = bookings.filter(b => b.business_id === userBusiness.id)
  const businessReviews = reviews.filter(r => r.business_id === userBusiness.id)

  const todayBookings = businessBookings.filter(b => {
    const today = new Date().toISOString().split('T')[0]
    return b.date === today
  })

  const averageRating = businessReviews.length > 0
    ? businessReviews.reduce((acc, review) => acc + review.rating, 0) / businessReviews.length
    : 0

  const totalRevenue = businessBookings
    .filter(b => b.status === 'completed')
    .reduce((acc, booking) => {
      const service = businessServices.find(s => s.id === booking.service_id)
      return acc + (service?.price || 0)
    }, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{userBusiness.name}</h1>
        <Button>Manage Business</Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayBookings.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}/5</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayBookings.length === 0 ? (
              <p className="text-muted-foreground">No bookings for today</p>
            ) : (
              todayBookings.map(booking => {
                const service = businessServices.find(s => s.id === booking.service_id)
                return (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{service?.name}</p>
                      <p className="text-sm text-muted-foreground">{booking.time}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Handle booking details */}}
                    >
                      View Details
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessReviews.slice(0, 5).map(review => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="font-medium">{review.rating}/5</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 