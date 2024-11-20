'use client'

import { usePointMe } from '../../../lib/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Calendar, Clock, Star } from 'lucide-react'

export default function CustomerDashboard() {
  const { bookings, services, businesses, reviews, loading, error } = usePointMe()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const upcomingBookings = bookings
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  const pastBookings = bookings
    .filter(b => b.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <p className="text-muted-foreground">No upcoming appointments</p>
            ) : (
              upcomingBookings.map(booking => {
                const service = services.find(s => s.id === booking.service_id)
                const business = businesses.find(b => b.id === booking.business_id)
                return (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{business?.name}</p>
                      <p className="text-sm text-muted-foreground">{service?.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(booking.date).toLocaleDateString()}
                        <Clock className="ml-2 mr-1 h-4 w-4" />
                        {booking.time}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Handle reschedule/cancel */}}
                    >
                      Manage
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Past Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastBookings.length === 0 ? (
              <p className="text-muted-foreground">No past appointments</p>
            ) : (
              pastBookings.map(booking => {
                const service = services.find(s => s.id === booking.service_id)
                const business = businesses.find(b => b.id === booking.business_id)
                const review = reviews.find(r => 
                  r.business_id === booking.business_id && 
                  r.customer_id === booking.customer_id
                )
                return (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{business?.name}</p>
                      <p className="text-sm text-muted-foreground">{service?.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                    </div>
                    {!review && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Handle review */}}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Leave Review
                      </Button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}