'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import type { Database } from '@/types/database'
import type { User } from '@supabase/auth-helpers-nextjs'

// Define user metadata type
interface UserMetadata {
  role: 'admin' | 'business' | 'customer'
}

// Extend User type to include metadata
interface PointMeUser extends User {
  user_metadata: UserMetadata
}

// Define error types
type PointMeError = {
  code: string
  message: string
  details?: string
}

type PointMeContextType = {
  user: PointMeUser | null
  businesses: Database['public']['Tables']['businesses']['Row'][]
  services: Database['public']['Tables']['services']['Row'][]
  bookings: Database['public']['Tables']['bookings']['Row'][]
  reviews: Database['public']['Tables']['reviews']['Row'][]
  loading: boolean
  error: PointMeError | null
  refreshData: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, role: string) => Promise<void>
  signOut: () => Promise<void>
  createBusiness: (businessData: Omit<Database['public']['Tables']['businesses']['Insert'], 'owner_id'>) => Promise<void>
  createService: (serviceData: Omit<Database['public']['Tables']['services']['Insert'], 'business_id'>) => Promise<void>
  createBooking: (bookingData: Omit<Database['public']['Tables']['bookings']['Insert'], 'customer_id'>) => Promise<void>
  createReview: (reviewData: Omit<Database['public']['Tables']['reviews']['Insert'], 'customer_id'>) => Promise<void>
  updateBusinessStatus: (businessId: string, status: 'active' | 'pending' | 'inactive') => Promise<void>
  updateBookingStatus: (bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => Promise<void>
}

const PointMeContext = createContext<PointMeContextType | undefined>(undefined)

export function PointMeProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PointMeUser | null>(null)
  const [businesses, setBusinesses] = useState<Database['public']['Tables']['businesses']['Row'][]>([])
  const [services, setServices] = useState<Database['public']['Tables']['services']['Row'][]>([])
  const [bookings, setBookings] = useState<Database['public']['Tables']['bookings']['Row'][]>([])
  const [reviews, setReviews] = useState<Database['public']['Tables']['reviews']['Row'][]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<PointMeError | null>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const fetchData = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) throw sessionError
      
      if (!session) {
        setUser(null)
        setLoading(false)
        return
      }

      setUser(session.user as PointMeUser)
      
      // Only fetch data if user is authenticated
      const [businessesData, servicesData, bookingsData, reviewsData] = await Promise.all([
        supabase.from('businesses').select('*'),
        supabase.from('services').select('*'),
        supabase.from('bookings').select('*'),
        supabase.from('reviews').select('*')
      ])

      setBusinesses(businessesData.data || [])
      setServices(servicesData.data || [])
      setBookings(bookingsData.data || [])
      setReviews(reviewsData.data || [])
      setError(null)
    } catch (error: any) {
      setError({
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred',
        details: error.details
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchData()
    })

    fetchData()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await fetchData()
  }

  const signUp = async (email: string, password: string, role: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setBusinesses([])
    setServices([])
    setBookings([])
    setReviews([])
  }

  const createBusiness = async (businessData: Omit<Database['public']['Tables']['businesses']['Insert'], 'owner_id'>) => {
    if (!user) throw new Error('Must be logged in to create a business')
    const { error } = await supabase
      .from('businesses')
      .insert([{ ...businessData, owner_id: user.id }])
    if (error) throw error
    await fetchData()
  }

  const createService = async (serviceData: Omit<Database['public']['Tables']['services']['Insert'], 'business_id'>) => {
    if (!user) throw new Error('Must be logged in to create a service')
    const userBusiness = businesses.find(b => b.owner_id === user.id)
    if (!userBusiness) throw new Error('Must have a business to create services')
    const { error } = await supabase
      .from('services')
      .insert([{ ...serviceData, business_id: userBusiness.id }])
    if (error) throw error
    await fetchData()
  }

  const createBooking = async (bookingData: Omit<Database['public']['Tables']['bookings']['Insert'], 'customer_id'>) => {
    if (!user) throw new Error('Must be logged in to create a booking')
    const { error } = await supabase
      .from('bookings')
      .insert([{ ...bookingData, customer_id: user.id }])
    if (error) throw error
    await fetchData()
  }

  const createReview = async (reviewData: Omit<Database['public']['Tables']['reviews']['Insert'], 'customer_id'>) => {
    if (!user) throw new Error('Must be logged in to create a review')
    const { error } = await supabase
      .from('reviews')
      .insert([{ ...reviewData, customer_id: user.id }])
    if (error) throw error
    await fetchData()
  }

  const updateBusinessStatus = async (businessId: string, status: 'active' | 'pending' | 'inactive') => {
    const { error } = await supabase
      .from('businesses')
      .update({ status })
      .eq('id', businessId)
    if (error) throw error
    await fetchData()
  }

  const updateBookingStatus = async (bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
    if (error) throw error
    await fetchData()
  }

  return (
    <PointMeContext.Provider value={{
      user,
      businesses,
      services,
      bookings,
      reviews,
      loading,
      error,
      refreshData: fetchData,
      signIn,
      signUp,
      signOut,
      createBusiness,
      createService,
      createBooking,
      createReview,
      updateBusinessStatus,
      updateBookingStatus
    }}>
      {children}
    </PointMeContext.Provider>
  )
}

export function usePointMe() {
  const context = useContext(PointMeContext)
  if (context === undefined) {
    throw new Error('usePointMe must be used within a PointMeProvider')
  }
  return context
} 