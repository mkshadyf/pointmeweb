import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const payload = await request.json()

    // Handle different webhook events
    switch (payload.type) {
      case 'booking.created':
        // Handle new booking
        await supabase.from('bookings').insert({ ...payload.data })
        break
      case 'review.submitted':
        // Handle new review
        await supabase.from('reviews').insert({ ...payload.data })
        break
      // Add other webhook handlers
    }

    return NextResponse.json({ message: 'Webhook processed' })
  } catch (error: unknown) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Invalid webhook payload' },
      { status: 400 }
    )
  }
}