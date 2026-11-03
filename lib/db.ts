import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If keys are missing (during Vercel prerendering), return a dummy object
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      from: () => ({
        select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }), order: () => ({ limit: () => ({ data: [], error: null }) }) }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ eq: () => ({ data: null, error: null }) }),
      }),
      auth: { getUser: () => ({ data: { user: null } }) },
    } as any
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}