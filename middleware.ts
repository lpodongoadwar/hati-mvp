import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only protect the admin route for now
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const hasAuthCookie = request.cookies.getAll().some((cookie) => 
      cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    )
    
    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}