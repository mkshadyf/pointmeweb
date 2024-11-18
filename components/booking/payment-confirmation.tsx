'use client'

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { useToast } from '../../hooks/use-toast'
import type { Database } from '../../types/database'
import { useState } from 'react'

type Business = Database['public']['Tables']['businesses']['Row']
type Service = Database['public']['Tables']['services']['Row']

interface PaymentConfirmationProps {
  business: Business
  service: Service
  bookingData: {
    date: string
    time: string
    customerName: string
    customerEmail: string
    customerPhone: string
    notes: string
  }
  onConfirm: () => Promise<void>
  isSubmitting?: boolean
}

export default function PaymentConfirmation({
  business,
  service,
  bookingData,
  onConfirm,
  isSubmitting = false,
}: PaymentConfirmationProps) {
  const { addToast } = useToast()
  const [processing, setProcessing] = useState(false)

  const handleConfirm = async () => {
    setProcessing(true)
    try {
      await onConfirm()
      addToast({
        title: 'Payment Successful',
        description: 'Your booking has been confirmed.',
        variant: 'success',
      })
    } catch (err) {
      addToast({
        title: 'Payment Failed',
        description: err instanceof Error ? err.message : 'Failed to process payment',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="font-medium">Service</dt>
              <dd className="text-muted-foreground">{service.name}</dd>
            </div>
            <div>
              <dt className="font-medium">Business</dt>
              <dd className="text-muted-foreground">{business.name}</dd>
            </div>
            <div>
              <dt className="font-medium">Date & Time</dt>
              <dd className="text-muted-foreground">
                {new Date(bookingData.date).toLocaleDateString()} at {bookingData.time}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Duration</dt>
              <dd className="text-muted-foreground">{service.duration} minutes</dd>
            </div>
            <div>
              <dt className="font-medium">Price</dt>
              <dd className="text-2xl font-bold">${service.price.toFixed(2)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="font-medium">Name</dt>
              <dd className="text-muted-foreground">{bookingData.customerName}</dd>
            </div>
            <div>
              <dt className="font-medium">Email</dt>
              <dd className="text-muted-foreground">{bookingData.customerEmail}</dd>
            </div>
            <div>
              <dt className="font-medium">Phone</dt>
              <dd className="text-muted-foreground">{bookingData.customerPhone}</dd>
            </div>
            {bookingData.notes && (
              <div>
                <dt className="font-medium">Notes</dt>
                <dd className="text-muted-foreground">{bookingData.notes}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Button 
        className="w-full" 
        size="lg"
        onClick={handleConfirm}
        disabled={processing}
      >
        {processing ? 'Processing...' : 'Confirm & Pay'}
      </Button>
    </div>
  )
}