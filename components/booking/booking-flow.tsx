'use client'

import { useState, useEffect } from 'react'
import { usePointMe } from '../../lib/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import ServiceSelection from './service-selection'
import Scheduling from './scheduling'
import CustomerDetails from './customer-details'
import PaymentConfirmation from './payment-confirmation'
import { Button } from '../ui/button'
import { useToast } from '../../hooks/use-toast'
//import type { Database } from '../../types/database'
import { Progress } from '../ui/progress'
import { Spinner } from '../ui/spinner'

type BookingStep = 'service' | 'schedule' | 'details' | 'payment'

interface BookingData {
  serviceId: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  customerPhone: string
  notes: string
}

interface BookingFlowProps {
  businessId: string
}

const initialBookingData: BookingData = {
  serviceId: '',
  date: '',
  time: '',
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  notes: '',
}

const validateBookingData = (data: BookingData): string | null => {
  if (!data.serviceId) return 'Please select a service'
  if (!data.date || !data.time) return 'Please select a date and time'
  if (!data.customerName) return 'Please enter your name'
  if (!data.customerEmail) return 'Please enter your email'
  if (!data.customerPhone) return 'Please enter your phone number'
  return null
}

export default function BookingFlow({ businessId }: BookingFlowProps) {
  const { businesses, services, createBooking, loading, error } = usePointMe()
  const { addToast } = useToast()
  const [currentStep, setCurrentStep] = useState<BookingStep>('service')
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    return () => {
      setBookingData(initialBookingData)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" role="status">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Loading booking system...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded" role="alert">
        <h3 className="font-bold">Error Loading Booking System</h3>
        <p>{error.message}</p>
      </div>
    )
  }

  const business = businesses.find(b => b.id === businessId)
  const availableServices = services.filter(s => s.business_id === businessId)

  if (!business) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded" role="alert">
        <h3 className="font-bold">Business Not Found</h3>
        <p>The requested business could not be found.</p>
      </div>
    )
  }

  const handleServiceSelect = (serviceId: string) => {
    setBookingData({ ...bookingData, serviceId })
    setCurrentStep('schedule')
  }

  const handleScheduleSelect = (date: string, time: string) => {
    setBookingData({ ...bookingData, date, time })
    setCurrentStep('details')
  }

  const handleCustomerDetails = (details: Omit<BookingData, 'serviceId' | 'date' | 'time'>) => {
    setBookingData({ ...bookingData, ...details })
    setCurrentStep('payment')
  }

  const handleBookingConfirmation = async () => {
    const validationError = validateBookingData(bookingData)
    if (validationError) {
      addToast({
        title: 'Validation Error',
        description: validationError,
        variant: 'destructive',
      })
      return
    }

    const selectedService = services.find(s => s.id === bookingData.serviceId)
    if (!selectedService) {
      addToast({
        title: 'Error',
        description: 'Selected service not found',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createBooking({
        id: crypto.randomUUID(),
        business_id: businessId,
        service_id: bookingData.serviceId,
        date: bookingData.date,
        time: bookingData.time,
        customer_name: bookingData.customerName,
        customer_email: bookingData.customerEmail,
        customer_phone: bookingData.customerPhone,
        notes: bookingData.notes,
        status: 'pending',
        payment_status: 'unpaid',
        payment_amount: selectedService.price
      })
      addToast({
        title: 'Booking Confirmed',
        description: 'Your appointment has been successfully booked.',
        variant: 'success',
      })
    } catch (err) {
      addToast({
        title: 'Booking Failed',
        description: err instanceof Error ? err.message : 'Failed to create booking',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps: Record<BookingStep, JSX.Element> = {
    service: (
      <ServiceSelection
        services={availableServices}
        selectedService={bookingData.serviceId}
        onSelect={handleServiceSelect}
      />
    ),
    schedule: (
      <Scheduling
        business={business}
        service={services.find(s => s.id === bookingData.serviceId)!}
        selectedDate={bookingData.date}
        selectedTime={bookingData.time}
        onSelect={handleScheduleSelect}
      />
    ),
    details: (
      <CustomerDetails
        formData={bookingData}
        onSubmit={(data: { customerName: string; customerEmail: string; customerPhone: string; notes?: string }) => {
          handleCustomerDetails({
            ...data,
            notes: data.notes || ''
          })
        }}
      />
    ),
    payment: (
      <PaymentConfirmation
        business={business}
        service={services.find(s => s.id === bookingData.serviceId)!}
        bookingData={bookingData}
        onConfirm={handleBookingConfirmation}
        isSubmitting={isSubmitting}
      />
    ),
  }

  const stepTitles: Record<BookingStep, string> = {
    service: 'Select Service',
    schedule: 'Choose Date & Time',
    details: 'Your Details',
    payment: 'Confirm & Pay',
  }

  const stepOrder: BookingStep[] = ['service', 'schedule', 'details', 'payment']
  const currentStepIndex = stepOrder.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{stepTitles[currentStep]}</CardTitle>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps[currentStep]}
          
          <div className="flex justify-between">
            {currentStepIndex > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(stepOrder[currentStepIndex - 1])}
                aria-label="Go back to previous step"
              >
                Back
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}