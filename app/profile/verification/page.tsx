"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function VerificationPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(data);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [supabase]);

  const maskData = (str: string) => {
    if (!str) return "Not provided";
    return str.substring(0, 3) + "*".repeat(Math.max(0, str.length - 5)) + str.substring(str.length - 2);
  };

  if (loading) return <div className="p-10 text-center">Loading verification status...</div>;
  if (!profile) return <div className="p-10 text-center">Please log in to view your verification status.</div>;

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/profile" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Profile
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1b4a3a]">Account Verification</h1>
          <p className="mt-2 text-gray-600">Review the information you submitted for your Hati Trust Score.</p>
        </div>

        {/* KYC Status Card */}
        <div className={`p-6 rounded-xl border ${profile.kyc_status === 'Verified' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center gap-3">
            {profile.kyc_status === 'Verified' ? <CheckCircle2 className="text-green-600 size-6" /> : <Clock className="text-yellow-600 size-6" />}
            <div>
              <h2 className="font-semibold text-lg">KYC Status: {profile.kyc_status || 'Pending'}</h2>
              <p className="text-sm text-gray-600">
                {profile.kyc_status === 'Verified' ? 'Your identity has been verified.' : 'Your documents are under review. This usually takes 24-48 hours.'}
              </p>
            </div>
          </div>
        </div>

        {/* Data Review */}
        <div className="bg-card border border-border/80 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Submitted Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium uppercase">{profile.full_name || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium">{maskData(profile.email)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{maskData(profile.phone)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">National ID (NIN)</p>
              <p className="font-medium flex items-center gap-2">
                {maskData(profile.nin)} 
                {profile.kyc_status === 'Verified' && <CheckCircle2 className="size-4 text-green-600" />}
              </p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-sm text-gray-500">Residential Address (As on NIN)</p>
              <p className="font-medium uppercase flex items-center gap-2">
                {profile.residential_address || "Not provided"}
                {profile.kyc_status === 'Verified' && <CheckCircle2 className="size-4 text-green-600" />}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}