"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserCheck } from "lucide-react";
import { createClient } from "@/lib/db";

export default function CompleteProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [phone, setPhone] = useState("");
  const [nin, setNin] = useState("");
  const [socialHandle, setSocialHandle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace('/login');
      return;
    }

    // Generate a safe username just in case the row doesn't exist yet
    const safeUsername = user.email?.split('@')[0] + "_" + Math.floor(Math.random() * 10000);

    // Using UPSERT to ensure the update goes through, and providing all NOT-NULL fields
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
        username: safeUsername, // Included to avoid null constraint on insert
        team: "individual",     // This is the fix for the error you're seeing
        phone: phone,
        nin: nin,
        social_handle: socialHandle,
      });

    if (error) {
      setMessage(`Error: ${error.message}`);
      setSaving(false);
    } else {
      // Use a hard redirect to force the dashboard to fetch the new data
      window.location.href = '/dashboard';
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
        </Link>

        <div className="space-y-2 text-center">
          <div className="bg-[#1b4a3a]/10 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-[#1b4a3a] mb-4">
            <UserCheck className="size-8" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Complete Your Profile</h1>
          <p className="text-muted-foreground">We need a few more details to activate your Hati Score.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-2xl border border-border/80 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
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

          <div className="space-y-2">
            <label className="text-sm font-medium">National ID (NIN)</label>
            <input
              type="text"
              placeholder="Enter your NIN"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={nin}
              onChange={(e) => setNin(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Social Media Handle (optional)</label>
            <input
              type="text"
              placeholder="@yourhandle or link"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={socialHandle}
              onChange={(e) => setSocialHandle(e.target.value)}
            />
          </div>

          {message && <p className="text-sm text-center font-medium text-red-500">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#1b4a3a] text-white hover:bg-[#153a2e] h-11 rounded-md font-medium disabled:opacity-50 mt-2"
          >
            {saving ? "Saving..." : "Save and Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}