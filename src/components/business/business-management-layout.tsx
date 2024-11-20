'use client'

import { usePointMe } from '../../../lib/hooks'
import { Card } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import BusinessDashboard from './business-dashboard'
import ServiceManagement from './service-management'
import AppointmentManagement from './appointment-management'
import BusinessAnalytics from './business-analytics'

export default function BusinessManagementLayout() {
  const { user, loading } = usePointMe()

  if (loading) return <div>Loading...</div>
  if (!user || user.user_metadata.role !== 'business') {
    return <div>Access Denied</div>
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="p-6">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <BusinessDashboard />
          </TabsContent>
          <TabsContent value="appointments">
            <AppointmentManagement />
          </TabsContent>
          <TabsContent value="services">
            <ServiceManagement />
          </TabsContent>
          <TabsContent value="analytics">
            <BusinessAnalytics />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 