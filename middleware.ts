import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get user session
  const { data: { user } } = await supabase.auth.getUser()

  // Protect Admin and Jury routes
  if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/jury')) {
    
    // 1. If not logged in, redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // 2. Check their roles in the database
    const { data: profile } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.roles?.includes('admin')
    const isJury = profile?.roles?.includes('jury')

    // 3. Block if they don't have the right role
    if (req.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (req.nextUrl.pathname.startsWith('/jury') && !isJury && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

// Ensure the middleware only runs on the protected paths
export const config = {
  matcher: ['/admin/:path*', '/jury/:path*'],
}