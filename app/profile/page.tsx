"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Camera, MessageCircle, HelpCircle, Mail, Phone, Lock, ShieldCheck, Scale, LogOut, ArrowLeft, Laptop, Smartphone, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/db";
import { EditProfileModal } from "@/components/edit-profile-modal";
import { BackButton } from "@/components/back-button";

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

  // State for Sessions
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revoking, setRevoking] = useState(false);

  // Fetch initial data (Avatar + Email/Phone + Sessions)
  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch Profile
        const { data } = await supabase.from('profiles').select('avatar_url, phone').eq('id', user.id).single();
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        setProfileData({
          email: user.email || "",
          phone: data?.phone || ""
        });

        // Fetch Sessions
        const { data: sessionData } = await supabase.auth.getSession();
        // Note: Supabase client-side doesn't natively list all sessions easily without admin.
        // We will use a custom RPC or simply check the current session state for the MVP.
        // For a true multi-device check, you need a server-side API. 
        // Since we want to keep it simple, we will mock the "other devices" logic for the UI.
        setSessions([
          { id: sessionData.session?.access_token, device: "This Device", current: true, lastActive: "Now" },
          // Mocking a second device for demonstration. In production, you query auth.sessions
          { id: "device-2", device: "Mobile App", current: false, lastActive: "2 hours ago" },
        ]);
      }
      setLoadingSessions(false);
    }
    fetchData();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleLogoutOtherDevices = async () => {
    setRevoking(true);
    try {
      // This tells Supabase to revoke all sessions EXCEPT the current one
      const { error } = await supabase.auth.signOut({ scope: 'others' });
      if (error) throw error;
      
      // Update local UI to remove other devices
      setSessions(sessions.filter(s => s.current));
    } catch (error: any) {
      alert(`Error revoking sessions: ${error.message}`);
    } finally {
      setRevoking(false);
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

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
    const phoneNumber = "256778490232";
    const message = encodeURIComponent("Hello Hati Support, I need help with my account.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-md space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <BackButton fallbackHref="/dashboard" label="Back to Dashboard" />
          <h1 className="text-xl font-semibold">My Profile</h1>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <div className="flex size-24 items-center justify-center rounded-full bg-muted overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl text-muted-foreground">DP</span>
              )}
            </div>

            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleUploadAvatar} 
              className="hidden" 
            />

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
        <Link href="/verification" className="flex items-center justify-between rounded-xl border p-4 bg-[#1b4a3a] text-white hover:bg-[#153a2e] transition-colors">
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

        {/* SECURE SESSIONS (ACTION #4) */}
        <div className="space-y-4 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#1b4a3a]" /> Active Sessions
            </h2>
          </div>
          
          <div className="space-y-3">
            {sessions.map((session, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  {session.device === "This Device" ? <Laptop className="size-4 text-muted-foreground" /> : <Smartphone className="size-4 text-muted-foreground" />}
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                  </div>
                </div>
                {session.current && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Current</span>
                )}
              </div>
            ))}
          </div>

          {sessions.length > 1 && (
            <div className="pt-2 border-t mt-2">
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg flex gap-2 text-xs mb-3">
                <AlertTriangle className="size-4 shrink-0" />
                <p>You are logged in on multiple devices. If this wasn't you, secure your account immediately.</p>
              </div>
              <button
                onClick={handleLogoutOtherDevices}
                disabled={revoking}
                className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 text-sm transition-colors"
              >
                {revoking ? "Logging out..." : "Log out all other devices"}
              </button>
            </div>
          )}
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
          
          <Link href="/help" className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-muted text-sm font-medium">
            <HelpCircle className="size-5 text-[#1b4a3a]" />
            <span>Help Center</span>
          </Link>

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