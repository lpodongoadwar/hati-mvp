"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/db";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setIsSubmitting(false);

    if (error) {
      alert(error.message);
    } else {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-2xl border shadow-sm text-center">
          <CheckCircle2 className="size-16 text-[#1b4a3a] mx-auto" />
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
          </p>
          <Link href="/login" className="mt-4 inline-block text-sm font-medium text-[#1b4a3a] hover:underline">
            Return to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 size-5 text-muted-foreground" />
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1b4a3a] text-white hover:bg-[#153a2e] h-10 px-4 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center text-sm">
          <Link href="/login" className="flex items-center justify-center gap-2 font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}