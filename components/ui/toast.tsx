'use client'

import { useToast } from '../../hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from './alert'
import { X } from 'lucide-react'
import { Button } from './button'

export function Toast() {
  const { toasts, removeToast } = useToast()

  const getVariant = (type: string) => {
    switch (type) {
      case 'error':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full max-w-sm p-4 space-y-4">
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          variant={getVariant(toast.type ?? 'default')}
          className="animate-slide-in-right"
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={() => removeToast(toast.id)}
          >
            <X className="h-4 w-4" />
          </Button>
          <AlertTitle>{toast.title}</AlertTitle>
          <AlertDescription>{toast.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
} 