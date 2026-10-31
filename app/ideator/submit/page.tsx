"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video, UploadCloud, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function SubmitPitchPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [videoUrl, setVideoUrl] = useState("");
  const [track, setTrack] = useState("club"); // Default to club
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to submit a pitch.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("pitches").insert([
      {
        user_id: user.id,
        track: track,
        video_url: videoUrl,
        status: "submitted",
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("Error submitting pitch. Please try again.");
    } else {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-sm border border-border/80 p-8 text-center space-y-4">
          <CheckCircle2 className="size-16 text-[#1b4a3a] mx-auto" />
          <h1 className="text-2xl font-bold">Pitch Submitted!</h1>
          <p className="text-muted-foreground">
            Your 1-minute pitch has been received. Keep an eye on your email and the Hati WhatsApp Channel for updates on the Round 1 results.
          </p>
          <Link href="/dashboard" className="mt-6 inline-block w-full bg-[#1b4a3a] text-white py-3 rounded-lg font-medium hover:bg-[#153a2e] transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/ideator" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Pipeline
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1b4a3a]">Submit Your Pitch</h1>
          <p className="mt-2 text-gray-600">Upload your 1-minute video pitch link (Loom or YouTube) to enter the competition.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Select Your Track</label>
            <select 
              value={track} 
              onChange={(e) => setTrack(e.target.value)}
              className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]"
            >
              <option value="club">Club Track (University Students & Alumni)</option>
              <option value="individual">Individual Track (Tier III Solo Founders)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">1-Minute Pitch Video URL</label>
            <div className="relative">
              <Video className="absolute left-3 top-3 size-5 text-muted-foreground" />
              <input 
                required 
                type="url" 
                placeholder="https://loom.com/share/..." 
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]"
              />
            </div>
            <p className="text-xs text-muted-foreground">Make sure the link is public or unlisted so our judges can view it.</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1b4a3a] text-white text-lg font-semibold py-4 rounded-xl hover:bg-[#153a2e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md mt-4"
          >
            {isSubmitting ? "Submitting..." : (
              <>
                <UploadCloud className="size-5" /> Submit Pitch
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}