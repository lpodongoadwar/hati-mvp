"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/db";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();
    const [showPassword, setShowPassword] = useState(false);

     const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setIsSubmitting(false);

    if (error) {
      alert(`Login Error: ${error.message}`);
    } else {
      router.refresh(); // Force Next.js to sync
      window.location.href = "/dashboard";
    }
  };
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back to Hati</h1>
          <p className="text-muted-foreground">Log in to check your score and referrals.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
                  <div className="space-y-2 mt-4">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Enter your password" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 pr-10 py-2 text-sm"
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
          
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm font-medium text-[#1b4a3a] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1b4a3a] text-white hover:bg-[#153a2e] h-10 px-4 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/" className="font-semibold underline text-[#1b4a3a]">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}