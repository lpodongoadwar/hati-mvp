"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { createClient } from "@/lib/db";

export function VerificationBanner() {
  const supabase = createClient();
  const [needsEmail, setNeedsEmail] = useState(false);
  const [needsPhone, setNeedsPhone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check Email (Supabase Auth)
        if (!user.email_confirmed_at) setNeedsEmail(true);

        // Check Phone (Our Database)
        const { data } = await supabase.from("profiles").select("phone_verified").eq("id", user.id).single();
        if (data && !data.phone_verified) setNeedsPhone(true);
      }
      setLoading(false);
    }
    checkStatus();
  }, [supabase]);

  if (loading || (!needsEmail && !needsPhone)) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-yellow-800">
        <AlertCircle className="size-5 shrink-0" />
        <div>
          <p className="font-semibold text-sm">Action Required: Verify your account</p>
          <p className="text-xs mt-1">
            {needsEmail && !needsPhone && "Please verify your email address to secure your account."}
            {!needsEmail && needsPhone && "Please verify your phone number to unlock higher tiers."}
            {needsEmail && needsPhone && "Please verify your email and phone number to unlock higher tiers."}
          </p>
        </div>
      </div>
      <Link 
        href="/profile" 
        className="whitespace-nowrap bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors shrink-0"
      >
        Verify Now
      </Link>
    </div>
  );
}