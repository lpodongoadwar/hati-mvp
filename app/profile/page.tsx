"use client";
import Link from "next/link";
import { User, Camera, MessageCircle, HelpCircle, Mail, Phone, Lock, ShieldCheck, Scale, LogOut, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-md space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 size-4" /> Back to Score
          </Link>
          <h1 className="text-xl font-semibold">My Profile</h1>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative flex size-24 items-center justify-center rounded-full bg-muted">
            <span className="text-2xl text-muted-foreground">DP</span>
            <button className="absolute bottom-0 right-0 rounded-full bg-[#1b4a3a] p-2 text-white">
              <Camera className="size-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">Tap to change photo</p>
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="size-4"/> Email</div>
            <button onClick={() => alert('Email edit modal coming soon!')} className="text-sm font-medium text-[#1b4a3a] hover:underline">Edit</button>
          </div>
          
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="size-4"/> Phone</div>
            <button onClick={() => alert('Phone edit modal coming soon!')} className="text-sm font-medium text-[#1b4a3a] hover:underline">Edit</button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Lock className="size-4"/> Password</div>
            <button onClick={() => alert('Password change modal coming soon!')} className="text-sm font-medium text-[#1b4a3a] hover:underline">Change</button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="space-y-2 rounded-xl border p-4">
          <h2 className="mb-2 font-semibold">Support</h2>
          
          <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-muted text-sm font-medium">
            <MessageCircle className="size-5 text-[#1b4a3a]" />
            <span>Live Chat</span>
          </button>
          
          <button className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-muted text-sm font-medium">
            <HelpCircle className="size-5 text-[#1b4a3a]" />
            <span>Help Center</span>
          </button>

          {/* New Legal Section */}
          <Link href="/legal" className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-muted text-sm font-medium">
            <Scale className="size-5 text-[#1b4a3a]" />
            <span>Legal & Compliance</span>
          </Link>
        </div>

        {/* Log Out Button */}
        <div className="pt-4">
          <Link 
            href="/" 
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 p-4 text-red-600 font-semibold hover:bg-red-100 transition-colors border border-red-200"
          >
            <LogOut className="size-5" />
            Log Out
          </Link>
        </div>

      </div>
    </main>
  );
}