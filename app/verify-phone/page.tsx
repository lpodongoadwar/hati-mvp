"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function VerifyPhonePage() {
  const supabase = createClient();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Fetch the user's phone number on load
    async function getPhone() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('phone').eq('id', user.id).single();
        setPhone(data?.phone || "your number");
      }
    }
    getPhone();
  }, [supabase]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile, error: dbError } = await supabase
      .from("profiles")
      .select("otp_code, otp_expires_at")
      .eq("id", user.id)
      .single();

    if (dbError || !profile) {
      setError("Could not fetch profile.");
      setIsVerifying(false);
      return;
    }

    // Check if code matches and hasn't expired
    const isExpired = new Date(profile.otp_expires_at) < new Date();
    
    if (profile.otp_code === otp && !isExpired) {
      // Success! Clear OTP and send to dashboard
      await supabase.from("profiles").update({ otp_code: null, otp_expires_at: null }).eq("id", user.id);
      router.push("/dashboard");
    } else {
      setError("Invalid or expired OTP. Please try again.");
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-2xl border border-border/80 shadow-sm text-center">
        <ShieldCheck className="size-12 text-[#1b4a3a] mx-auto" />
        <h1 className="text-2xl font-bold">Verify your number</h1>
        <p className="text-muted-foreground text-sm">
          We sent a 6-digit code to <strong>{phone}</strong>. Enter it below to secure your account.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center text-3xl tracking-[0.5em] font-mono h-14 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isVerifying || otp.length < 6}
            className="w-full bg-[#1b4a3a] text-white h-12 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#153a2e] disabled:opacity-50"
          >
            {isVerifying ? "Verifying..." : "Verify & Continue"} <ArrowRight className="size-5" />
          </button>
        </form>
      </div>
    </main>
  );
}