"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, UploadCloud, Mail } from "lucide-react";
import { createClient } from "@/lib/db";
import { z } from "zod";
import { BackButton } from "@/components/back-button";

// Validation schema for Personal Details
const personalDetailsSchema = z.object({
  phone: z
    .string()
    .regex(/^[7][0-9]{8}$/, "Please enter a valid 9-digit Ugandan phone number."),
  nin: z
    .string()
    .regex(/^(CM|CF)[0-9A-Z]{12}$/, "NIN must start with CM or CF and be 14 characters total."),
  socialHandle: z.string().optional(),
});

export default function VerificationPage() {
  const supabase = createClient();
  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [message, setMessage] = useState("");

  // OTP States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");
  const [nin, setNin] = useState("");
  const [socialHandle, setSocialHandle] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        setProfile(data);
        if (data) {
          setPhone(data.phone || "");
          setNin(data.nin || "");
          setSocialHandle(data.social_handle || "");
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, [supabase]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingInfo(true);
    setMessage("");

    // Validate inputs using Zod
    try {
      personalDetailsSchema.parse({ phone, nin, socialHandle });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setMessage(`Error: ${error.issues[0].message}`);
        setSavingInfo(false);
        return;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({ phone, nin, social_handle: socialHandle })
      .eq("id", profile.id);

    if (error) {
      setMessage(`Error saving info: ${error.message}`);
    } else {
      setMessage("Personal details saved successfully!");
      setProfile({ ...profile, phone, nin, social_handle: socialHandle });
    }
    setSavingInfo(false);
  };

  const handleUploadID = async (e: React.FormEvent) => {
    e.preventDefault();
    const frontFile = fileInputFrontRef.current?.files?.[0];
    const backFile = fileInputBackRef.current?.files?.[0];

    if (!frontFile || !backFile || !profile) {
      setMessage("Please select both front and back images of your ID.");
      return;
    }

    setUploading(true);
    setMessage("Uploading documents...");

    try {
      // 1. Upload images
      const frontExt = frontFile.name.split('.').pop();
      const frontName = `${profile.id}-front-${Date.now()}.${frontExt}`;
      const { error: frontError } = await supabase.storage.from('kyc-documents').upload(frontName, frontFile);
      if (frontError) throw frontError;

      const backExt = backFile.name.split('.').pop();
      const backName = `${profile.id}-back-${Date.now()}.${backExt}`;
      const { error: backError } = await supabase.storage.from('kyc-documents').upload(backName, backFile);
      if (backError) throw backError;

      const { data: { publicUrl: frontUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(frontName);
      const { data: { publicUrl: backUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(backName);

      // 2. Save URLs to profile
      const { error: dbError } = await supabase
        .from("profiles")
        .update({
          id_front_url: frontUrl,
          id_back_url: backUrl,
        })
        .eq("id", profile.id);

      if (dbError) throw dbError;

      // 3. Trigger OTP Email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: false }
      });

      if (otpError) throw otpError;

      // 4. Switch to OTP Screen
      setMessage("");
      setShowOtpScreen(true);

    } catch (err: any) {
      setMessage(`Upload Error: ${err.message}`);
    }

    setUploading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'email'
    });

    if (error) {
      setMessage(`Verification failed: ${error.message}`);
      setUploading(false);
      return;
    }

    // Mark KYC as Pending now that email is verified
    await supabase.from("profiles").update({ kyc_status: 'Pending' }).eq("id", profile.id);

    setMessage("Documents submitted successfully! They are now pending review.");
    setProfile({ ...profile, kyc_status: 'Pending' });
    setShowOtpScreen(false);
    setUploading(false);
  };

  if (loading) return <div className="p-10 text-center">Loading verification status...</div>;
  if (!profile) return <div className="p-10 text-center text-muted-foreground">Could not load profile. Please return to the dashboard and try again.</div>;

  // --- OTP SCREEN RENDER ---
  if (showOtpScreen) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-[#1b4a3a]/10 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center text-[#1b4a3a]">
          <Mail className="size-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Verify your Email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit verification code to <strong>{email}</strong> to secure your KYC submission.
          </p>
        </div>
        <form onSubmit={handleVerifyOtp} className="space-y-4 pt-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="flex h-12 w-full text-center tracking-[0.5em] text-lg font-bold rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              maxLength={6}
              required
            />
          </div>
          {message && <p className="text-sm text-center font-medium text-red-500">{message}</p>}
          <button
            type="submit"
            disabled={uploading || otpCode.length < 6}
            className="w-full bg-[#1b4a3a] text-white hover:bg-[#153a2e] h-12 rounded-lg font-semibold text-lg flex items-center justify-center px-6 transition-colors disabled:opacity-50"
          >
            {uploading ? "Verifying..." : "Verify and Submit"}
          </button>
        </form>
      </div>
    );
  }

  // --- VERIFICATION FORM RENDER ---
  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <BackButton fallbackHref="/profile" label="Back to Profile" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1b4a3a]">Account Verification</h1>
          <p className="mt-2 text-gray-600">Upload your National ID to verify your identity and unlock Tier II.</p>
        </div>

        <div className={`p-6 rounded-xl border ${profile.kyc_status === 'Verified' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center gap-3">
            {profile.kyc_status === 'Verified' ? <CheckCircle2 className="text-green-600 size-6" /> : <Clock className="text-yellow-600 size-6" />}
            <div>
              <h2 className="font-semibold text-lg">KYC Status: {profile.kyc_status || 'Pending'}</h2>
              <p className="text-sm text-gray-600">
                {profile.kyc_status === 'Verified'
                  ? 'Your identity has been verified. You now have full access.'
                  : 'Your documents are under review. This usually takes 24-48 hours.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Personal Details</h2>
          <p className="text-sm text-gray-600">Complete your profile information to proceed with KYC.</p>

          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  placeholder="7XX XXX XXX"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">National ID (NIN)</label>
                <input
                  type="text"
                  placeholder="e.g. CM1234567890AB"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={nin}
                  onChange={(e) => setNin(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Social Media Handle (optional)</label>
              <input
                type="text"
                placeholder="@yourhandle or link"
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={socialHandle}
                onChange={(e) => setSocialHandle(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={savingInfo}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
            >
              {savingInfo ? "Saving..." : "Save Details"}
            </button>
          </form>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">National ID Verification</h2>
          <p className="text-sm text-gray-600">Please upload clear photos of the front and back of your National ID.</p>

          <form onSubmit={handleUploadID} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Front</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputFrontRef}
                  required
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Back</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputBackRef}
                  required
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-[#1b4a3a] text-white py-3 rounded-lg font-medium hover:bg-[#153a2e] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UploadCloud className="size-5" />
              {uploading ? "Uploading..." : "Submit ID for Verification"}
            </button>
            {message && <p className="text-sm text-center font-medium text-[#1b4a3a]">{message}</p>}
          </form>
        </div>

        <div className="bg-card border border-border/80 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Submitted Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium uppercase">{profile.full_name || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">National ID (NIN)</p>
              <p className="font-medium">{profile.nin || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}