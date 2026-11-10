"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/db";
import { Eye, EyeOff } from "lucide-react"; // Add this line

// 1. Inner component containing the actual form logic
function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referrerId = searchParams.get("ref"); // Grabs the '?ref=...' from the URL
    const [showPassword, setShowPassword] = useState(false);
  
  const supabase = createClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nin, setNin] = useState("");
  const [socialHandle, setSocialHandle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError || !authData.user) {
      alert(authError?.message || "Auth failed");
      setIsSubmitting(false);
      return;
    }

    // 2. Save Profile (WITH REFERRAL TRACKING)
    const { error: dbError } = await supabase.from('profiles').upsert([{ 
      id: authData.user.id, 
      full_name: fullName, 
      phone: phone, 
      username: username, 
      email: email, 
      nin: nin, 
      social_handle: socialHandle, 
      score: 200, // <--- Base score set here
      team: 'individual', 
      referral_count: 0, 
      completed_modules: [],
      referred_by: referrerId || null
    }]);

    if (dbError) {
      alert(`DB Error: ${dbError.message}`);
      setIsSubmitting(false);
      return;
    }

    // 3. Send OTP
    await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: authData.user.id, phone: phone })
    });

        // 4. Log initial score history
    await supabase.from('score_history').insert([
      { user_id: authData.user.id, score: 200 }
    ]);

        // 5. Redirect directly to dashboard (Pesapal removed)
    window.location.href = '/dashboard';
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
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
        <label className="text-sm font-medium">Social Media Handle (optional, add as many as you like)</label>
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
            I agree to the <Link href="/terms" className="underline text-primary">Terms & Conditions</Link>
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

// 2. Outer export wrapping the form in Suspense
export function CreditScoreForm() {
  return (
    <Suspense fallback={<div className="text-center py-4 text-sm text-muted-foreground">Loading form...</div>}>
      <FormContent />
    </Suspense>
  );
}