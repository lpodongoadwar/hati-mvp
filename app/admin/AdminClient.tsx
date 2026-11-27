"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Users, Lightbulb, TrendingUp, CheckCircle2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/db";

type Profile = {
  id: string;
  full_name: string;
  email: string; // Added email for verification notification
  phone: string;
  team: string;
  referral_count: number;
  kyc_status: string;
  completed_modules: string[];
  id_front_url: string | null;
  id_back_url: string | null;
};

type Idea = {
  id: string;
  founder_name: string;
  startup_name: string;
  category: string;
  video_url: string;
  votes: number;
  status: string;
  jury_score: number;
  jury_notes: string;
};

export function AdminClient() {
  const supabase = createClient();
  
  // Auth States
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Data States
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"pipeline" | "jury" | "users">("pipeline");

  // 1. Verify Admin Access via Supabase
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setAuthLoading(false);
        return;
      }
      
      const { data: profile } = await supabase.from("profiles").select("roles").eq("id", user.id).single();
      
      if (profile?.roles?.includes('admin')) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    }
    checkAdmin();
  }, [supabase]);

  // 2. Load Admin Data
  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    
    const { data: profileData } = await supabase.from("profiles").select("*").order("referral_count", { ascending: false });
    if (profileData) setProfiles(profileData);

    const { data: ideaData } = await supabase.from("ideas").select("*").order("created_at", { ascending: false });
    if (ideaData) setIdeas(ideaData);
    
    setLoading(false);
  }, [supabase, isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin, loadAdminData]);

  const handleBoostVotes = async (idea: Idea, amount: number) => {
    setUpdatingId(idea.id);
    const newVotes = Math.max(0, idea.votes + amount);
    const { error } = await supabase.from("ideas").update({ votes: newVotes }).eq("id", idea.id);
    if (!error) {
      setIdeas((prev) => prev.map((i) => i.id === idea.id ? { ...i, votes: newVotes } : i).sort((a, b) => b.votes - a.votes));
    }
    setUpdatingId(null);
  };

  // Updated Verify Function with Email Trigger
  const handleVerifyUser = async (userId: string, userEmail: string, userName: string) => {
    // 1. Update Database
    const { error } = await supabase
      .from('profiles')
      .update({ kyc_status: 'Verified' })
      .eq('id', userId);

    if (error) {
      alert("Error verifying user in database");
      return;
    }

    // 2. Trigger Email
    try {
      await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, name: userName }),
      });
    } catch (emailError) {
      console.error("Database updated, but email failed to send:", emailError);
    }

    // 3. Refresh the table
    loadAdminData();
  };

  // --- RENDER STATES ---

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Verifying Admin Access...</div>;
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card p-8 rounded-2xl border border-red-200 text-center space-y-4 shadow-sm">
          <ShieldAlert className="size-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">You do not have administrative privileges to view this page.</p>
          <Link href="/dashboard" className="inline-block mt-4 text-sm font-medium text-[#1b4a3a] underline">
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const totalUsers = profiles.length;
  const totalIdeas = ideas.length;
  const totalReferrals = profiles.reduce((sum, p) => sum + (p.referral_count || 0), 0);
  
  // Filter ideas for the Jury tab
  const screenedIdeas = ideas.filter(i => i.status === 'screened' || i.status === 'rejected').sort((a, b) => b.jury_score - a.jury_score);

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="bg-[#0a1f17] text-white border-b border-border/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-6 text-[#c4f080]" />
            <h1 className="text-xl font-bold">Hati Command Center</h1>
          </div>
          <Link href="/dashboard" className="text-sm text-white/70 hover:text-white transition-colors">
            Exit to App
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 text-blue-700 p-3 rounded-full"><Users className="size-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold">{totalUsers}</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex items-center gap-4">
            <div className="bg-purple-100 text-purple-700 p-3 rounded-full"><Lightbulb className="size-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pitches</p>
              <p className="text-3xl font-bold">{totalIdeas}</p>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex items-center gap-4">
            <div className="bg-green-100 text-green-700 p-3 rounded-full"><TrendingUp className="size-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
              <p className="text-3xl font-bold">{totalReferrals}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/80">
          <button 
            onClick={() => setActiveTab("pipeline")} 
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "pipeline" ? "border-[#1b4a3a] text-[#1b4a3a]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Startup Pipeline
          </button>
          <button 
            onClick={() => setActiveTab("jury")} 
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "jury" ? "border-[#1b4a3a] text-[#1b4a3a]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Jury Results ({screenedIdeas.length})
          </button>
          <button 
            onClick={() => setActiveTab("users")} 
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === "users" ? "border-[#1b4a3a] text-[#1b4a3a]" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            User Directory & KYC
          </button>
        </div>

        {/* TAB 1: STARTUP PIPELINE */}
        {activeTab === "pipeline" && (
          <section className="space-y-4">
            <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Startup / Founder</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Pitch Video</th>
                    <th className="px-6 py-4 font-medium text-center">Votes</th>
                    <th className="px-6 py-4 font-medium text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80">
                  {ideas.map((idea) => (
                    <tr key={idea.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{idea.startup_name}</p>
                        <p className="text-xs text-muted-foreground">{idea.founder_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-[#1b4a3a]/10 px-2.5 py-0.5 text-xs font-medium text-[#1b4a3a]">
                          {idea.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a href={idea.video_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          Watch Demo
                        </a>
                      </td>
                      <td className="px-6 py-4 text-center font-bold tabular-nums">{idea.votes}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => handleBoostVotes(idea, 10)} disabled={updatingId === idea.id} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors">
                          +10 Votes
                        </button>
                        <button onClick={() => handleBoostVotes(idea, -10)} disabled={updatingId === idea.id} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors">
                          -10 Votes
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ideas.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No pitches submitted yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: JURY RESULTS */}
        {activeTab === "jury" && (
          <section className="space-y-4">
            <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Rank</th>
                    <th className="px-6 py-4 font-medium">Startup Name</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium text-center">Jury Score</th>
                    <th className="px-6 py-4 font-medium text-center">Status</th>
                    <th className="px-6 py-4 font-medium">Jury Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80">
                  {screenedIdeas.map((idea, index) => (
                    <tr key={idea.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4 font-bold text-muted-foreground">#{index + 1}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{idea.startup_name}</td>
                      <td className="px-6 py-4">{idea.category}</td>
                      <td className="px-6 py-4 text-center font-bold text-[#1b4a3a]">{idea.jury_score}/10</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${idea.status === 'screened' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {idea.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground truncate max-w-xs" title={idea.jury_notes}>{idea.jury_notes || "-"}</td>
                    </tr>
                  ))}
                  {screenedIdeas.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">The jury has not screened any pitches yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: USER DIRECTORY */}
        {activeTab === "users" && (
          <section className="space-y-4">
            <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Phone</th>
                    <th className="px-6 py-4 font-medium text-center">Referrals</th>
                    <th className="px-6 py-4 font-medium text-center">ID Docs</th>
                    <th className="px-6 py-4 font-medium text-right">KYC Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-muted/20">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {profile.full_name || "N/A"}
                      </td>
                      <td className="px-6 py-4">{profile.phone || "N/A"}</td>
                      <td className="px-6 py-4 text-center font-bold tabular-nums">{profile.referral_count || 0}</td>

                      <td className="px-6 py-4 text-center space-x-2">
                        {profile.id_front_url ? (
                          <a href={profile.id_front_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">
                            Front
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">None</span>
                        )}
                        {profile.id_back_url && (
                          <a href={profile.id_back_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs ml-2">
                            Back
                          </a>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {profile.kyc_status === 'Verified' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700">
                            <CheckCircle2 className="size-3" /> Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerifyUser(profile.id, profile.email || "", profile.full_name || "Student")}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                          >
                            Approve KYC
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {profiles.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}