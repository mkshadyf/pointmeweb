'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { MapPin } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface LocationFeaturesProps {
  onLocationSelect: (location: string) => void
}

export default function LocationFeatures({ onLocationSelect }: LocationFeaturesProps) {
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState('5')
  const [loading, setLoading] = useState(false)

  const handleLocationSearch = () => {
    if (location) {
      onLocationSelect(location)
    }
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Using Nominatim (OpenStreetMap) for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
              {
                headers: {
                  'Accept-Language': 'en'
                }
              }
            )
            const data = await response.json()
            if (data.display_name) {
              setLocation(data.display_name)
              onLocationSelect(data.display_name)
            }
          } catch (error) {
            console.error('Error getting location:', error)
          } finally {
            setLoading(false)
          }
        },
        (error) => {
          console.error('Error getting location:', error)
          setLoading(false)
        }
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Services Near You</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Button onClick={handleLocationSearch}>
              Search
            </Button>
          </div>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGetCurrentLocation}
            disabled={loading}
          >
            <MapPin className="mr-2 h-4 w-4" />
            {loading ? 'Getting location...' : 'Use Current Location'}
          </Button>

          <div className="space-y-2">
            <label>Search Radius</label>
            <Select value={radius} onValueChange={setRadius}>
              <SelectTrigger>
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="20">20 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 