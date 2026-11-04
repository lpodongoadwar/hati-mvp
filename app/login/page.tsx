"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const router = useRouter();

  useEffect(() => {
    // This traps the back button on the login page
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Connect to Supabase auth here later. 
    // Currently, this just simulates a successful login and redirects.
    router.push("/dashboard");
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
            <label className="text-sm font-medium">Phone Number</label>
            <input 
              type="text" 
              placeholder="+256 700 000 000" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm font-medium text-[#1b4a3a] hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#1b4a3a] text-white hover:bg-[#153a2e] h-10 px-4 py-2 rounded-md font-medium"
          >
            Log In
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