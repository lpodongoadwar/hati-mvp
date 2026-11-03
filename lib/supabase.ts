import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  // If keys are missing (e.g., during build prerendering), return a dummy client
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      throw new Error('Supabase URL and Key are missing. Check your environment variables.');
    }
    // Return a mock that does nothing during server-side build
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