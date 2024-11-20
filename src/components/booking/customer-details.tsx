'use client'

import { useState } from 'react'
//import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Alert, AlertDescription } from '../ui/alert'
import { z } from 'zod'

const customerSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number'),
  notes: z.string().optional(),
})

type CustomerDetailsFormData = z.infer<typeof customerSchema>

interface CustomerDetailsProps {
  formData: CustomerDetailsFormData
  onSubmit: (data: CustomerDetailsFormData) => void
}

export default function CustomerDetails({
  formData,
  onSubmit,
}: CustomerDetailsProps) {
  const [values, setValues] = useState<CustomerDetailsFormData>(formData)
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetailsFormData, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerDetailsFormData, boolean>>>({})

  const validateField = (field: keyof CustomerDetailsFormData, value: string) => {
    try {
      customerSchema.shape[field].parse(value)
      setErrors(prev => ({ ...prev, [field]: undefined }))
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: err.errors[0].message }))
      }
    }
  }

  const handleChange = (field: keyof CustomerDetailsFormData, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validateField(field, value)
    }
  }

  const handleBlur = (field: keyof CustomerDetailsFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validateField(field, values[field] || '')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate all fields
    Object.keys(values).forEach(key => {
      const typedKey = key as keyof CustomerDetailsFormData
      const value = values[typedKey]
      if (value !== undefined) {
        validateField(typedKey, value)
      }
    })

    try {
      const validatedData = customerSchema.parse(values)
      onSubmit(validatedData)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: typeof errors = {}
        err.errors.forEach(error => {
          if (error.path[0]) {
            newErrors[error.path[0] as keyof CustomerDetailsFormData] = error.message
          }
        })
        setErrors(newErrors)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="customerName">Full Name</label>
          <Input
            id="customerName"
            value={values.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            onBlur={() => handleBlur('customerName')}
          //  error={touched.customerName && errors.customerName}
          />
          {touched.customerName && errors.customerName && (
            <Alert variant="destructive">
              <AlertDescription>{errors.customerName}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="customerEmail">Email</label>
          <Input
            id="customerEmail"
            type="email"
            value={values.customerEmail}
            onChange={(e) => handleChange('customerEmail', e.target.value)}
            onBlur={() => handleBlur('customerEmail')}
          //  error={touched.customerEmail && errors.customerEmail}
          />
          {touched.customerEmail && errors.customerEmail && (
            <Alert variant="destructive">
              <AlertDescription>{errors.customerEmail}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="customerPhone">Phone Number</label>
          <Input
            id="customerPhone"
            type="tel"
            value={values.customerPhone}
            onChange={(e) => handleChange('customerPhone', e.target.value)}
            onBlur={() => handleBlur('customerPhone')}
          //  error={touched.customerPhone && errors.customerPhone}
          />
          {touched.customerPhone && errors.customerPhone && (
            <Alert variant="destructive">
              <AlertDescription>{errors.customerPhone}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="notes">Additional Notes</label>
          <Textarea
            id="notes"
            value={values.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any special requests or information..."
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Continue to Payment
      </Button>
    </form>
  )
} 