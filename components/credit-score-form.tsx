"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db";

export function CreditScoreForm() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nin, setNin] = useState("");
  const [socialHandle, setSocialHandle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Calculate a dummy score for now (Base 200)
    const initialScore = 200;

    // 2. Insert into Supabase
    const { error } = await supabase
      .from('profiles')
      .insert([
        { 
          phone: phone,
          username: username,
          email: email,
          nin: nin,
          social_handle: socialHandle,
          score: initialScore,
          team: 'red', // Default team for now
          referral_count: 0
        }
      ]);

    setIsSubmitting(false);

    // 3. Handle Success or Error
    if (error) {
      console.error(error);
      // THIS WILL SHOW US EXACTLY WHY IT FAILED
      alert(`Database Error: ${error.message}\nDetails: ${error.details}\nHint: ${error.hint}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
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
        <input 
          type="password" 
          placeholder="Create a password" 
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
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

      {/* Upload Mini Statement */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Upload Mini Statement (PDF)</label>
        <input 
          type="file" 
          accept=".pdf"
          className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
          required
        />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Dial *165# (MTN) or *185# (Airtel) and select "Mini Statement" to get this PDF.
        </p>
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
        className="w-full bg-[#1b4a3a] text-white hover:bg-[#153a2e] h-12 rounded-lg font-semibold text-lg flex items-center justify-between px-6 transition-colors disabled:opacity-50"
      >
        <span>{isSubmitting ? "Saving..." : "Unlock Score for UGX 2,000."}</span>
        <div className="bg-white/20 rounded-full p-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
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
