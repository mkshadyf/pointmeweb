'use client'

import { usePointMe } from '../../lib/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { MapPin, Clock, Phone, Mail, Globe, Star } from 'lucide-react'
import ReviewSystem from '../reviews/review-system'
import type { Database } from '../../types/database'

type Business = Database['public']['Tables']['businesses']['Row']
type BusinessHours = {
  [key: string]: {
    open: string
    close: string
    closed: boolean
  }
}

interface BusinessProfileProps {
  businessId: string
  onBookingClick: () => void
}

export default function BusinessProfile({ businessId, onBookingClick }: BusinessProfileProps) {
  const { businesses, services, reviews, loading, error } = usePointMe()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const business = businesses.find(b => b.id === businessId)
  if (!business) return <div>Business not found</div>

  const businessServices = services.filter(s => s.business_id === businessId)
  const businessReviews = reviews.filter(r => r.business_id === businessId)
  const averageRating = businessReviews.length > 0
    ? businessReviews.reduce((acc, r) => acc + r.rating, 0) / businessReviews.length
    : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{business.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{business.category}</p>
            </div>
            {averageRating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">{business.description}</p>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                {business.address}
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2" />
                {business.phone}
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2" />
                {business.email}
              </div>
              {business.website && (
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-2" />
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {business.website}
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Business Hours</h4>
              {Object.entries(business.hours as BusinessHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="capitalize">{day}</span>
                  <span>{hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Services</h4>
              <div className="grid gap-2">
                {businessServices.map(service => (
                  <div key={service.id} className="flex justify-between items-center p-2 rounded-lg border">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">{service.duration} mins</p>
                    </div>
                    <p className="font-medium">${service.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={onBookingClick}>
              Book Appointment
            </Button>
          </div>
        </CardContent>
      </Card>

      <ReviewSystem businessId={businessId} />
    </div>
  )
}