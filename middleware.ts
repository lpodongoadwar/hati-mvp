import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the Supabase auth cookie exists
  const hasAuthCookie = request.cookies.getAll().some((cookie) => 
    cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
  )

  const isAuthPage = request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login'
  const isProtectedPage = 
    request.nextUrl.pathname.startsWith('/dashboard') || 
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/curriculum') ||
    request.nextUrl.pathname.startsWith('/ideator')

  // If trying to access a protected page without a cookie, send to login
  if (isProtectedPage && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If trying to access login/signup while already logged in, send to dashboard
  if (isAuthPage && hasAuthCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Ensure the middleware runs on all relevant routes
export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/profile/:path*',
    '/curriculum/:path*',
    '/ideator/:path*',
  ],
}