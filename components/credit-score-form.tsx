"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/db";
import { Eye, EyeOff } from "lucide-react";

function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referrerId = searchParams.get("ref");
  const supabase = createClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nin, setNin] = useState("");
  const [socialHandle, setSocialHandle] = useState("");

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
      },
    });

    if (authError || !authData.user) {
      alert(authError?.message || "Auth failed");
      setIsSubmitting(false);
      return;
    }

    // 2. Save Profile
    const { error: dbError } = await supabase.from("profiles").upsert([
      {
        id: authData.user.id,
        full_name: fullName,
        phone: phone,
        username: username,
        email: email,
        nin: nin,
        social_handle: socialHandle,
        score: 200,
        team: "individual",
        referral_count: 0,
        completed_modules: [],
        referred_by: referrerId || null,
        kyc_status: "Pending", // Default KYC status
      },
    ]);

    if (dbError) {
      alert(`DB Error: ${dbError.message}`);
      setIsSubmitting(false);
      return;
    }

    // 3. Log initial score history
    await supabase.from("score_history").insert([{ user_id: authData.user.id, score: 200 }]);

    // 4. Redirect straight to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">
      
      {/* Google Button and Divider */}
      <div className="space-y-6 mb-6">
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 h-11 rounded-md font-medium hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign up with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or sign up with email</span>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <input
          type="text"
          placeholder="As it appears on your National ID"
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">Must match your National ID exactly.</p>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone number</label>
        <div className="flex h-11 w-full rounded-md border border-input bg-background text-sm overflow-hidden">
          <div className="flex items-center px-3 border-r border-input bg-muted/50 text-muted-foreground">
            +256
          </div>
          <input
            type="tel"
            placeholder="7XX XXX XXX"
            className="flex-1 bg-transparent px-3 py-2 focus:outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Username */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Username</label>
        <input
          type="text"
          placeholder="Choose a username"
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className="flex h-11 w-full rounded-md border border-input bg-background px-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* NIN */}
      <div className="space-y-2">
        <label className="text-sm font-medium">National Identification Number (NIN)</label>
        <input
          type="text"
          placeholder="Enter your NIN"
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={nin}
          onChange={(e) => setNin(e.target.value)}
          required
        />
      </div>

      {/* Social Media */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Social Media Handle (optional)</label>
        <input
          type="text"
          placeholder="@yourhandle or link (X, TikTok, IG)"
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={socialHandle}
          onChange={(e) => setSocialHandle(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">We'll follow you.</p>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="terms" className="rounded border-gray-300" required />
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            I agree to the{" "}
            <Link href="/terms" className="underline text-primary">
              Terms & Conditions
            </Link>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="sim" className="rounded border-gray-300" required />
          <label htmlFor="sim" className="text-sm text-muted-foreground">
            I confirm I control this phone number
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1b4a3a] text-white hover:bg-[#153a2e] h-12 rounded-lg font-semibold text-lg flex items-center justify-center px-6 transition-colors disabled:opacity-50"
      >
        <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
      </button>

      {/* Login Link */}
      <div className="text-center text-sm mt-6">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="font-semibold underline text-[#1b4a3a]">
            Log in
          </a>
        </p>
      </div>
    </form>
  );
}

export function CreditScoreForm() {
  return (
    <Suspense fallback={<div className="text-center py-4 text-sm text-muted-foreground">Loading form...</div>}>
      <FormContent />
    </Suspense>
  );
}