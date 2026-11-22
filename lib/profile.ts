import { SupabaseClient } from "@supabase/supabase-js";

export async function ensureProfileExists(supabase: SupabaseClient, user: any) {
  if (!user) return;

  // 1. Check if profile exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  // 2. If it exists, do nothing
  if (profile) return;

  // 3. If it doesn't exist, create it using Google Metadata
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
  const avatarUrl = user.user_metadata?.avatar_url || null;

  const { error } = await supabase.from("profiles").insert([
    {
      id: user.id,
      email: user.email,
      full_name: fullName,
      avatar_url: avatarUrl,
      score: 200,
      kyc_status: "Pending",
      completed_modules: [],
      referral_count: 0,
      phone_verified: false,
    },
  ]);

  if (error) {
    console.error("Error creating fallback profile:", error);
  }
}