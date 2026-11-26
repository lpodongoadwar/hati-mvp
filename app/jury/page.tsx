"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/db";
import { ArrowLeft, CheckCircle2, XCircle, PlayCircle, Star } from "lucide-react";
import Link from "next/link";

export default function JuryDashboard() {
  const supabase = createClient();
  const router = useRouter();
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Scoring State
  const [score, setScore] = useState(5);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function checkAccessAndFetch() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      // Verify Role
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      
      if (profile?.role !== 'jury' && profile?.role !== 'admin') {
        // Kick out non-jury members
        router.replace("/dashboard");
        return;
      }
      setUserRole(profile.role);

      // Fetch pending ideas
      const { data: ideasData } = await supabase
        .from("ideas")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      setIdeas(ideasData || []);
      setLoading(false);
    }
    checkAccessAndFetch();
  }, [supabase, router]);

  const currentIdea = ideas[currentIndex];

  const handleVote = async (decision: 'screened' | 'rejected') => {
    if (!currentIdea) return;
    setIsSubmitting(true);

    const { error } = await supabase
      .from("ideas")
      .update({
        status: decision,
        jury_score: score,
        jury_notes: notes
      })
      .eq("id", currentIdea.id);

    setIsSubmitting(false);

    if (error) {
      alert("Error saving vote: " + error.message);
    } else {
      // Move to next idea
      setScore(5);
      setNotes("");
      if (currentIndex < ideas.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert("You have reviewed all pending pitches!");
        router.push("/dashboard");
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Verifying Jury Access...</div>;
  if (!currentIdea) return <div className="p-10 text-center">No pending pitches to review. Great job!</div>;

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Exit Jury Portal
          </Link>
          <span className="text-sm font-semibold bg-[#1b4a3a] text-white px-3 py-1 rounded-full">
            Jury Mode
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-[#1b4a3a]">Reviewing Pitch {currentIndex + 1} of {ideas.length}</span>
          <span className="text-muted-foreground">{Math.round(((currentIndex) / ideas.length) * 100)}% Complete</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full mb-6">
          <div className="h-2 bg-[#1b4a3a] rounded-full" style={{ width: `${(currentIndex / ideas.length) * 100}%` }}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Pitch Details (Left) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1b4a3a]">{currentIdea.category}</span>
                <h1 className="text-3xl font-bold mt-1">{currentIdea.startup_name}</h1>
                <p className="text-muted-foreground">By {currentIdea.founder_name}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">The Problem & Solution</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{currentIdea.description}</p>
              </div>

              <div className="border-t pt-4">
                <a 
                  href={currentIdea.video_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#fcfaf6] border border-[#e5e1d8] px-4 py-3 rounded-lg text-[#1b4a3a] font-semibold hover:bg-gray-100 transition-colors w-full"
                >
                  <PlayCircle className="size-5" /> Watch 1-Minute Demo Video
                </a>
              </div>
            </div>
          </div>

          {/* Scoring Panel (Right) */}
          <div className="space-y-6">
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-6 sticky top-24">
              <h2 className="text-xl font-bold">Cast Your Vote</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Score (1-10)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        onClick={() => setScore(num)}
                        className={`size-8 rounded-md text-sm font-bold transition-colors ${
                          score === num ? "bg-[#1b4a3a] text-white" : "bg-muted text-muted-foreground hover:bg-gray-200"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Internal Jury Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Why did you give this score? (Only visible to Jury)"
                    className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]"
                  />
                </div>

                <div className="pt-4 border-t space-y-2">
                  <button
                    onClick={() => handleVote('screened')}
                    disabled={isSubmitting}
                    className="w-full bg-[#1b4a3a] text-white py-3 rounded-lg font-semibold hover:bg-[#153a2e] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="size-5" /> Advance to Next Round
                  </button>
                  
                  <button
                    onClick={() => handleVote('rejected')}
                    disabled={isSubmitting}
                    className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="size-5" /> Reject Idea
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}