"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/db";

export default function VerificationPage() {
  const supabase = createClient();
  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

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
      // 1. Upload Front ID
      const frontExt = frontFile.name.split('.').pop();
      const frontName = `${profile.id}-front-${Date.now()}.${frontExt}`;
      const { error: frontError } = await supabase.storage.from('kyc-documents').upload(frontName, frontFile);
      if (frontError) throw frontError;

      // 2. Upload Back ID
      const backExt = backFile.name.split('.').pop();
      const backName = `${profile.id}-back-${Date.now()}.${backExt}`;
      const { error: backError } = await supabase.storage.from('kyc-documents').upload(backName, backFile);
      if (backError) throw backError;

      // 3. Get Public URLs
      const { data: { publicUrl: frontUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(frontName);
      const { data: { publicUrl: backUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(backName);

      // 4. Update Profile
      const { error: dbError } = await supabase
        .from("profiles")
        .update({
          id_front_url: frontUrl,
          id_back_url: backUrl,
          kyc_status: 'Pending' // Reset to pending if they re-upload
        })
        .eq("id", profile.id);

      if (dbError) throw dbError;

      setMessage("Documents submitted successfully! They are now pending review.");
      setProfile({ ...profile, id_front_url: frontUrl, id_back_url: backUrl, kyc_status: 'Pending' });

    } catch (err: any) {
      setMessage(`Upload Error: ${err.message}`);
    }

    setUploading(false);
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
          <p className="mt-2 text-gray-600">Upload your National ID to verify your identity and unlock Tier II.</p>
        </div>

        {/* KYC Status Card */}
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

        {/* ID Upload Section */}
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

        {/* Submitted Information */}
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