export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'business' | 'customer'
          full_name?: string
          phone?: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      businesses: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string
          category: string
          email: string
          phone: string
          address: string
          location: {
            latitude: number
            longitude: number
          }
          website?: string
          status: 'pending' | 'active' | 'inactive'
          hours: BusinessHours
          settings: BusinessSettings
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['businesses']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['businesses']['Insert']>
      }
      services: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string
          price: number
          duration: number
          capacity: number
          is_available: boolean
          category?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          business_id: string
          service_id: string
          customer_id: string
          date: string
          time: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          customer_name: string
          customer_email: string
          customer_phone: string
          notes?: string
          payment_status: 'pending' | 'paid' | 'refunded' | 'unpaid'
          payment_amount: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          customer_id: string
          booking_id?: string
          rating: number
          comment: string
          reply?: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          data: NotificationData
          read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      platform_settings: {
        Row: {
          id: string
          max_businesses_per_user: number
          max_services_per_business: number
          booking_slot_duration: number
          max_advance_booking_days: number
          min_cancellation_hours: number
          commission_rate: number
          platform_currency: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['platform_settings']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['platform_settings']['Insert']>
      }
    }
    Views: {
      business_analytics: {
        Row: {
          business_id: string
          total_bookings: number
          total_revenue: number
          average_rating: number
          review_count: number
          period: 'day' | 'week' | 'month' | 'year'
          date: string
        }
      }
      popular_services: {
        Row: {
          service_id: string
          business_id: string
          booking_count: number
          average_rating: number
          period: 'day' | 'week' | 'month' | 'year'
        }
      }
    }
    Functions: {
      get_available_slots: {
        Args: {
          business_id: string
          service_id: string
          date: string
        }
        Returns: {
          time: string
          available: boolean
        }[]
      }
      search_businesses: {
        Args: {
          search_term: string
          category?: string
          location?: {
            latitude: number
            longitude: number
            radius: number
          }
        }
        Returns: Tables<'businesses'>['Row'][]
      }
    }
    Enums: {
      business_category: 'health' | 'beauty' | 'fitness' | 'professional' | 'other'
      booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
      payment_status: 'pending' | 'paid' | 'refunded'
    }
  }
}

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean }
  tuesday: { open: string; close: string; closed: boolean }
  wednesday: { open: string; close: string; closed: boolean }
  thursday: { open: string; close: string; closed: boolean }
  friday: { open: string; close: string; closed: boolean }
  saturday: { open: string; close: string; closed: boolean }
  sunday: { open: string; close: string; closed: boolean }
}

export interface BusinessSettings {
  notification_preferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
  booking_preferences: {
    advance_notice_hours: number
    max_bookings_per_day: number
    allow_instant_booking: boolean
    cancellation_policy: {
      allowed: boolean
      min_hours_notice: number
      refund_percentage: number
    }
  }
  payment_settings: {
    accept_online_payments: boolean
    require_advance_payment: boolean
    deposit_percentage?: number
    refund_policy?: string
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export interface NotificationData {
  title: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  metadata?: Record<string, unknown>
}