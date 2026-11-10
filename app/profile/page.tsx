"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Camera, MessageCircle, HelpCircle, Mail, Phone, Lock, ShieldCheck, Scale, LogOut, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/db";
import { EditProfileModal } from "@/components/edit-profile-modal";
import { Crisp } from "crisp-sdk-web";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Profile Picture
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // State for Edit Modals
  const [modalType, setModalType] = useState<"email" | "phone" | "password" | null>(null);
  const [profileData, setProfileData] = useState({ email: "", phone: "" });

  // Fetch initial data (Avatar + Email/Phone)
  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('avatar_url, phone').eq('id', user.id).single();
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        setProfileData({
          email: user.email || "",
          phone: data?.phone || ""
        });
      }
    }
    fetchData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // 3. Save URL to profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleLiveChat = () => {
    Crisp.chat.hide();
    const phoneNumber = "256778490232";
    const message = encodeURIComponent("Hello Hati Support, I need help with my account.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-md space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
          <h1 className="text-xl font-semibold">My Profile</h1>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">

            {/* Inner container that clips the image */}
            <div className="flex size-24 items-center justify-center rounded-full bg-muted overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl text-muted-foreground">DP</span>
              )}
            </div>

            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleUploadAvatar} 
              className="hidden" 
            />

            {/* Camera Button */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 rounded-full bg-[#1b4a3a] p-2 text-white hover:bg-[#153a2e] transition-colors disabled:opacity-50 shadow-md border-2 border-background"
            >
              <Camera className="size-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            {uploading ? "Uploading..." : "Tap to change photo"}
          </p>
        </div>

        {/* Verification Button */}
        <Link href="/profile/verification" className="flex items-center justify-between rounded-xl border p-4 bg-[#1b4a3a] text-white hover:bg-[#153a2e] transition-colors">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5" />
            <span className="font-semibold">Verification Status</span>
          </div>
          <ArrowLeft className="size-4 rotate-180" />
        </Link>

        {/* Edit Details */}
        <div className="space-y-4 rounded-xl border p-4">
          <h2 className="font-semibold text-lg">Account Details</h2>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4"/> Email
            </div>
            <button
              onClick={() => setModalType("email")}
              className="text-sm font-medium text-[#1b4a3a] hover:underline"
            >
              Edit
            </button>
          </div>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4"/> Phone
            </div>
            <button
              onClick={() => setModalType("phone")}
              className="text-sm font-medium text-[#1b4a3a] hover:underline"
            >
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="size-4"/> Password
            </div>
            <button
              onClick={() => setModalType("password")}
              className="text-sm font-medium text-[#1b4a3a] hover:underline"
            >
              Change
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="space-y-2 rounded-xl border p-4">
          <h2 className="mb-2 font-semibold">Support</h2>

          <button
            onClick={handleLiveChat}
            className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-muted text-sm font-medium"
          >
            <MessageCircle className="size-5 text-[#1b4a3a]" />
            <span>Live Chat</span>
          </button>
          
          <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-muted text-sm font-medium">
            <HelpCircle className="size-5 text-[#1b4a3a]" />
            <span>Help Center</span>
          </button>

          <Link href="/legal" className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-muted text-sm font-medium">
            <Scale className="size-5 text-[#1b4a3a]" />
            <span>Legal & Compliance</span>
          </Link>
        </div>

        {/* Log Out Button */}
        <div className="pt-4">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 p-4 text-red-600 font-semibold hover:bg-red-100 transition-colors border border-red-200"
          >
            <LogOut className="size-5" />
            Log Out
          </button>
        </div>
      </div>

      {/* The Edit Modal */}
      <EditProfileModal
        isOpen={modalType !== null}
        type={modalType}
        currentValue={modalType === "email" ? profileData.email : modalType === "phone" ? profileData.phone : ""}
        onClose={() => setModalType(null)}
        onSuccess={() => {
          const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data } = await supabase.from("profiles").select("phone").eq("id", user.id).single();
              setProfileData({ email: user.email || "", phone: data?.phone || "" });
            }
          };
          fetchData();
        }}
      />
    </main>
  );
}