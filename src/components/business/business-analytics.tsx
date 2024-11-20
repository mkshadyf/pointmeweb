'use client'

import { usePointMe } from '../../../lib/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
} from '../ui/charts'

type BookingStats = {
  date: string
  bookings: number
  revenue: number
}

type ServiceStats = {
  name: string
  bookings: number
  revenue: number
}

type ReviewStats = {
  date: string
  rating: number
  count: number
}

export default function BusinessAnalytics() {
  const { businesses, services, bookings, reviews, loading, error } = usePointMe()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const userBusiness = businesses[0] // Assuming one business per user for now
  if (!userBusiness) return <div>No business found</div>

  const businessServices = services.filter(s => s.business_id === userBusiness.id)
  const businessBookings = bookings.filter(b => b.business_id === userBusiness.id)
  const businessReviews = reviews.filter(r => r.business_id === userBusiness.id)

  // Process data for charts
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const bookingStats: BookingStats[] = last30Days.map(date => {
    const dayBookings = businessBookings.filter(b => b.date === date)
    const dayRevenue = dayBookings.reduce((acc, booking) => {
      const service = businessServices.find(s => s.id === booking.service_id)
      return acc + (service?.price || 0)
    }, 0)

    return {
      date,
      bookings: dayBookings.length,
      revenue: dayRevenue
    }
  })

  const serviceStats: ServiceStats[] = businessServices.map(service => {
    const serviceBookings = businessBookings.filter(b => b.service_id === service.id)
    return {
      name: service.name,
      bookings: serviceBookings.length,
      revenue: serviceBookings.length * service.price
    }
  }).sort((a, b) => b.revenue - a.revenue)

  const reviewStats: ReviewStats[] = last30Days.map(date => {
    const dayReviews = businessReviews.filter(r => 
      r.created_at.split('T')[0] === date
    )
    return {
      date,
      rating: dayReviews.length > 0 
        ? dayReviews.reduce((acc, r) => acc + r.rating, 0) / dayReviews.length 
        : 0,
      count: dayReviews.length
    }
  })

  return (
    <div className="space-y-6">
      {/* Booking Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={6}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={6}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="bookings"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Review Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Review Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reviewStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={6}
                />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#fbbf24"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}