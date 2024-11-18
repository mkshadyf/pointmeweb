'use client'

import { usePointMe } from '../../lib/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from '../ui/charts'

type ChartData = {
  date: string
  bookings?: number
  businesses?: number
}

export default function AnalyticsDashboard() {
  const { businesses, bookings, loading, error } = usePointMe()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  // Process data for charts
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const bookingsByDate: ChartData[] = last30Days.map(date => ({
    date,
    bookings: bookings.filter(b => b.date === date).length
  }))

  const businessGrowth: ChartData[] = last30Days.map(date => ({
    date,
    businesses: businesses.filter(b => 
      new Date(b.created_at).toISOString().split('T')[0] <= date
    ).length
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingsByDate}>
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

      <Card>
        <CardHeader>
          <CardTitle>Business Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart<ChartData> data={businessGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis<ChartData>
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={6}
                />
                <YAxis<ChartData> />
                <Tooltip<ChartData> />
                <Line<ChartData>
                  type="monotone"
                  dataKey="businesses"
                  stroke="#82ca9d"
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