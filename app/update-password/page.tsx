"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-2xl border shadow-sm text-center">
          <CheckCircle2 className="size-16 text-[#1b4a3a] mx-auto" />
          <h1 className="text-2xl font-bold">Password Updated!</h1>
          <p className="text-muted-foreground">
            Your password has been successfully changed. You are being redirected to the login page.
          </p>
          <Link href="/login" className="mt-4 inline-block text-sm font-medium text-[#1b4a3a] hover:underline">
            Go to Login now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Set New Password</h1>
          <p className="text-muted-foreground">Enter your new password below.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md border border-red-200">
              {errorMsg}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 size-5 text-muted-foreground" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 size-5 text-muted-foreground" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1b4a3a] text-white hover:bg-[#153a2e] h-10 px-4 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}