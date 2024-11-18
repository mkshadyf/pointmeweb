'use client'

import { usePointMe } from '../../lib/hooks'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Users, 
  Store, 
  Calendar, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react'

export default function AdminDashboard() {
  const { businesses, bookings, loading, error } = usePointMe()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const totalBusinesses = businesses.length
  const activeBusinesses = businesses.filter(b => b.status === 'active').length
  const pendingBusinesses = businesses.filter(b => b.status === 'pending').length
  const totalBookings = bookings.length
  const recentBookings = bookings.slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Businesses</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{totalBusinesses}</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Active Businesses</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{activeBusinesses}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Pending Approval</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{pendingBusinesses}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Bookings</h3>
          </div>
          <p className="mt-2 text-2xl font-bold">{totalBookings}</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">Booking #{booking.id.slice(0, 8)}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(booking.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {/* Handle view details */}}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Pending Approvals */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Business Approvals</h2>
        <div className="space-y-4">
          {businesses
            .filter(business => business.status === 'pending')
            .map((business) => (
              <div key={business.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{business.name}</p>
                  <p className="text-sm text-muted-foreground">{business.category}</p>
                </div>
                <div className="space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {/* Handle approve */}}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {/* Handle reject */}}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
} 