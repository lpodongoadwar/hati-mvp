import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // This prevents the build from crashing on the server
    // It will only throw an error if it runs in the browser without keys
    if (typeof window !== "undefined") {
      throw new Error("Supabase URL and Key are missing from environment variables.");
    }
    return null as any;
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
}