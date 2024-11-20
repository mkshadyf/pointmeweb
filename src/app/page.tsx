// src/app/page.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import BusinessDiscovery from '@/components/discovery/business-discovery'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to PointMe</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Discover Local Services</CardTitle>
          <CardDescription>Find and book appointments with ease</CardDescription>
        </CardHeader>
        <CardContent>
          <BusinessDiscovery />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>For Customers</CardTitle>
            <CardDescription>Book services from local businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Discover and book appointments with local service providers. Manage your bookings and leave reviews all in one place.</p>
            <Link href="/customer-dashboard">
              <Button>Go to Customer Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Businesses</CardTitle>
            <CardDescription>Manage your services and appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">List your services, manage appointments, and grow your business with our easy-to-use platform.</p>
            <Link href="/business-dashboard">
              <Button>Go to Business Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}