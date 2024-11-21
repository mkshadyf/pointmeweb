import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth protection for specific routes
  if (!session) {
    if (
      req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/admin') ||
      req.nextUrl.pathname.startsWith('/business')
    ) {
      const redirectUrl = new URL('/sign-in', req.url)
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Role-based protection
  if (session) {
    const userRole = session.user.user_metadata.role

    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      userRole !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (
      req.nextUrl.pathname.startsWith('/business') &&
      userRole !== 'business'
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/business/:path*',
  ],
} 