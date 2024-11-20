'use client'

import { usePointMe } from '../../../lib/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Bell, Calendar, Star } from 'lucide-react'
import { Button } from '../ui/button'

type Notification = {
  id: string
  type: 'booking' | 'review' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
}

export default function NotificationHub() {
  const { bookings, reviews, loading, error } = usePointMe()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  // Generate notifications from bookings and reviews
  const notifications: Notification[] = [
    ...bookings.map(booking => ({
      id: `booking-${booking.id}`,
      type: 'booking' as const,
      title: 'Upcoming Appointment',
      message: `You have an appointment scheduled for ${new Date(booking.date).toLocaleDateString()} at ${booking.time}`,
      timestamp: booking.created_at,
      read: false
    })),
    ...reviews.map(review => ({
      id: `review-${review.id}`,
      type: 'review' as const,
      title: 'New Review',
      message: `Someone left a ${review.rating}-star review`,
      timestamp: review.created_at,
      read: false
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4" />
      case 'review':
        return <Star className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground">No notifications</p>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border ${
                    notification.read ? 'bg-background' : 'bg-accent/10'
                  }`}
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {/* Handle mark as read */}}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 