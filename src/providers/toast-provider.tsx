'use client'

import { useToast } from '../../hooks/use-toast'
import { Toast } from '../components/ui/toast'

export function ToastProvider() {
  const { toasts } = useToast()

  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  )
}