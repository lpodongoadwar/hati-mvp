import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      throw new Error('Supabase URL and Key are missing.');
    }
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