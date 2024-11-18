'use client'

import { usePointMe } from '../../lib/hooks'
import { Card } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import AdminDashboard from './admin-dashboard'
import BusinessOversight from './business-oversight'
import PlatformManagement from './platform-management'
import AnalyticsDashboard from './analytics-dashboard'

export default function AdminPanelLayout() {
  const { user, loading } = usePointMe()

  if (loading) return <div>Loading...</div>
  if (!user || user.user_metadata.role !== 'admin') {
    return <div>Access Denied</div>
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="p-6">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="businesses">Businesses</TabsTrigger>
            <TabsTrigger value="platform">Platform</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          <TabsContent value="businesses">
            <BusinessOversight />
          </TabsContent>
          <TabsContent value="platform">
            <PlatformManagement />
          </TabsContent>
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}