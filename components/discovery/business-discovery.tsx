'use client'

import { useState } from 'react'
import { usePointMe } from '../../lib/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { MapPin, Star, Clock } from 'lucide-react'
import LocationFeatures from './location-features'

interface BusinessHours {
  monday: { open: string; close: string; closed: boolean }
  // ... other days
}

export default function BusinessDiscovery() {
  const { businesses, services, reviews, loading, error } = usePointMe()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string | null>(null)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  // Get unique categories
  const categories = Array.from(new Set(businesses.map(b => b.category)))

  // Filter businesses
  const filteredBusinesses = businesses
    .filter(business => 
      business.status === 'active' &&
      (categoryFilter === 'all' || business.category === categoryFilter) &&
      (!locationFilter || business.address.toLowerCase().includes(locationFilter.toLowerCase())) &&
      (
        searchQuery === '' ||
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )

  const getBusinessRating = (businessId: string) => {
    const businessReviews = reviews.filter(r => r.business_id === businessId)
    if (businessReviews.length === 0) return null
    return businessReviews.reduce((acc, r) => acc + r.rating, 0) / businessReviews.length
  }

  const getBusinessServices = (businessId: string) => {
    return services.filter(s => s.business_id === businessId)
  }

  return (
    <div className="space-y-6">
      <LocationFeatures onLocationSelect={setLocationFilter} />

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Business List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBusinesses.map(business => {
          const rating = getBusinessRating(business.id)
          const businessServices = getBusinessServices(business.id)
          
          return (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{business.name}</span>
                  {rating && (
                    <span className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {rating.toFixed(1)}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {business.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {business.address}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {business.hours.monday?.closed ? 'Closed' : `${business.hours.monday?.open} - ${business.hours.monday?.close}`}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Services</p>
                    <div className="flex flex-wrap gap-2">
                      {businessServices.slice(0, 3).map(service => (
                        <span
                          key={service.id}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {service.name}
                        </span>
                      ))}
                      {businessServices.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{businessServices.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <Button className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}