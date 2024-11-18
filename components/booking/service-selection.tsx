'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import type { Tables } from '../../types/database'

type Service = Tables<'services'>['Row']

interface ServiceSelectionProps {
  services: Service[]
  selectedService: string
  onSelect: (serviceId: string) => void
}

export default function ServiceSelection({
  services,
  selectedService,
  onSelect,
}: ServiceSelectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((service) => (
        <Card
          key={service.id}
          className={cn(
            "cursor-pointer transition-colors hover:bg-accent",
            selectedService === service.id && "border-primary"
          )}
          onClick={() => onSelect(service.id)}
        >
          <CardHeader>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>
              Duration: {service.duration} minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
              <p className="text-lg font-bold">
                ${service.price.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 