import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const pendingCookies: { name: string; value: string; options: any }[] = []

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach((cookie) => pendingCookies.push(cookie))
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // --- START SAFETY NET ---
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        // If no profile, create one using Google Data
        if (!existingProfile) {
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0];
          const avatarUrl = user.user_metadata?.avatar_url || null;

          await supabase.from("profiles").insert([{
            id: user.id,
            email: user.email,
            full_name: fullName,
            avatar_url: avatarUrl,
            score: 200,
            kyc_status: "Pending",
            completed_modules: [],
            referral_count: 0,
            phone_verified: false,
          }]);
        }
      }
      // --- END SAFETY NET ---

      const response = NextResponse.redirect(`${origin}${next}`)
      pendingCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options)
      })
      return response
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}