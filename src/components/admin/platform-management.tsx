'use client'

import { useState, useEffect } from 'react'
import { usePointMe } from '../../../lib/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useToast } from '../../hooks/use-toast'
//import type { Database } from '../../types/database'
import { Spinner } from '../ui/spinner'
import { supabase } from '@/lib/supabase'

interface FormData {
  max_businesses_per_user: number
  max_services_per_business: number
  booking_slot_duration: number
  max_advance_booking_days: number
  min_cancellation_hours: number
}

const initialFormData: FormData = {
  max_businesses_per_user: 3,
  max_services_per_business: 10,
  booking_slot_duration: 30,
  max_advance_booking_days: 30,
  min_cancellation_hours: 24,
}

export default function PlatformManagement() {
  const { loading, error } = usePointMe()
  const { addToast } = useToast()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('*')
        .single()

      if (error) {
        addToast({
          title: 'Error',
          description: 'Failed to load settings',
          variant: 'destructive',
        })
        return
      }

      if (data) {
        setFormData({
          max_businesses_per_user: data.max_businesses_per_user,
          max_services_per_business: data.max_services_per_business,
          booking_slot_duration: data.booking_slot_duration,
          max_advance_booking_days: data.max_advance_booking_days,
          min_cancellation_hours: data.min_cancellation_hours,
        })
      }
    }

    fetchSettings()
  }, [addToast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('platform_settings')
        .update(formData)
        .eq('id', 1) // Assuming single settings row with id 1

      if (error) throw error

      addToast({
        title: 'Settings Updated',
        description: 'Platform settings have been successfully updated.',
        variant: 'success',
      })
    } catch (err) {
      console.error('Failed to update settings:', err)
      addToast({
        title: 'Update Failed',
        description: err instanceof Error ? err.message : 'Failed to update settings',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Loading settings...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded">
        <h3 className="font-bold">Error</h3>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label>Max Businesses per User</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.max_businesses_per_user}
                  onChange={(e) => setFormData({
                    ...formData,
                    max_businesses_per_user: parseInt(e.target.value)
                  })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label>Max Services per Business</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.max_services_per_business}
                  onChange={(e) => setFormData({
                    ...formData,
                    max_services_per_business: parseInt(e.target.value)
                  })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label>Booking Slot Duration (minutes)</label>
                <Input
                  type="number"
                  min={15}
                  step={15}
                  value={formData.booking_slot_duration}
                  onChange={(e) => setFormData({
                    ...formData,
                    booking_slot_duration: parseInt(e.target.value)
                  })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label>Max Advance Booking Days</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.max_advance_booking_days}
                  onChange={(e) => setFormData({
                    ...formData,
                    max_advance_booking_days: parseInt(e.target.value)
                  })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label>Min Cancellation Hours</label>
                <Input
                  type="number"
                  min={1}
                  value={formData.min_cancellation_hours}
                  onChange={(e) => setFormData({
                    ...formData,
                    min_cancellation_hours: parseInt(e.target.value)
                  })}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 