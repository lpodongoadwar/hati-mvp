"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db";

export function CreditScoreForm() {
  const router = useRouter();
  const supabase = createClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Added for PDF upload
  
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

    let calculatedScore = 200; // Default fallback

    // 1. Parse the PDF if a file is selected
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        
        if (data.success) {
          calculatedScore = data.score; // Use the score from Gemini AI
        }
      } catch (err) {
        console.error("Failed to parse PDF, using base score.", err);
      }
    }

    // 2. Create the Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) {
      alert(`Auth Error: ${authError.message}`);
      setIsSubmitting(false);
      return;
    }

    // 3. Insert into the profiles table with the calculated score
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id,
            phone: phone,
            username: username,
            email: email,
            nin: nin,
            social_handle: socialHandle,
            score: calculatedScore, // <--- USE THE AI SCORE HERE
            team: 'red', 
            referral_count: 0,
            completed_modules: []
          }
        ]);

      if (dbError) {
        alert(`Database Error: ${dbError.message}\nDetails: ${dbError.details}`);
      } else {
        router.push('/dashboard');
      }
    }
    setIsSubmitting(false);
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
          ref={fileInputRef} // <--- ADDED THE REF HERE
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
        <span>{isSubmitting ? "Analyzing & Saving..." : "Unlock Score for UGX 2,000."}</span>
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