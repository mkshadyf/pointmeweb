'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import type { Tables } from '../../types/database'

type Business = Tables<'businesses'>['Row']
type Service = Tables<'services'>['Row']

interface SchedulingProps {
  business: Business
  service: Service
  selectedDate: string
  selectedTime: string
  onSelect: (date: string, time: string) => void
}

export default function Scheduling({
  business,
  service,
  selectedDate,
  selectedTime,
  onSelect,
}: SchedulingProps) {
  if (!service) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded">
        <p>Please select a service first</p>
      </div>
    )
  }

  const [date, setDate] = useState<Date | undefined>(
    selectedDate ? new Date(selectedDate) : undefined
  )

  const getTimeSlots = (selectedDate: Date) => {
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const hours = business.hours[dayOfWeek as keyof typeof business.hours]
    
    if (!hours || hours.closed) return []

    const slots: string[] = []
    const startTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${hours.open}`)
    const endTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${hours.close}`)
    const duration = service.duration

    let currentSlot = startTime
    while (currentSlot < endTime) {
      slots.push(currentSlot.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }))
      currentSlot = new Date(currentSlot.getTime() + duration * 60000)
    }

    return slots
  }

  const timeSlots = date ? getTimeSlots(date) : []

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(currentDate: Date) => {
              const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
              const hours = business.hours[day as keyof typeof business.hours]
              return (
                currentDate < new Date() || // Past dates
                hours?.closed || // Closed days
                !hours // No hours defined
              )
            }}
          />
        </CardContent>
      </Card>

      {date && (
        <Card>
          <CardHeader>
            <CardTitle>Select Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  onClick={() => {
                    onSelect(
                      date.toISOString().split('T')[0],
                      time
                    )
                  }}
                >
                  {time}
                </Button>
              ))}
            </div>
            {timeSlots.length === 0 && (
              <p className="text-center text-muted-foreground">
                No available time slots for this date
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}