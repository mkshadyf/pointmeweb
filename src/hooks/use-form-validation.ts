import { useState } from 'react'

interface ValidationRules<T> {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T) => boolean | string
}

interface ValidationErrors {
  [key: string]: string
}

export function useFormValidation<T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: {
    [K in keyof T]?: ValidationRules<T[K]>
  }
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(() =>
    Object.keys(initialValues).reduce((acc, key) => ({
      ...acc,
      [key]: false,
    }), {} as Record<keyof T, boolean>)
  )

  const validate = (name: keyof T, value: T[keyof T]): string => {
    const rules = validationRules[name]
    if (!rules) return ''

    if (rules.required && !value) {
      return 'This field is required'
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength}`
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength}`
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Invalid format'
    }

    if (rules.custom) {
      const result = rules.custom(value)
      if (typeof result === 'string') return result
      if (!result) return 'Invalid value'
    }

    return ''
  }

  const handleChange = (name: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [name]: value }))
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validate(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validate(name, values[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateAll = () => {
    const newErrors: ValidationErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach((name) => {
      const error = validate(name as keyof T, values[name as keyof T])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setValues,
  }
}