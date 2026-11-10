"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Users, Lightbulb, TrendingUp, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/db";

type Profile = {
  id: string;
  full_name: string;
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
};

export function AdminClient() {
  const supabase = createClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const ADMIN_PASSCODE = "HatiAdmin2026!";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect passcode");
    }
  };

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    const { data: profileData } = await supabase.from("profiles").select("*").order("referral_count", { ascending: false });
    if (profileData) setProfiles(profileData);

    const { data: ideaData } = await supabase.from("ideas").select("*").order("votes", { ascending: false });
    if (ideaData) setIdeas(ideaData);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated, loadAdminData]);

  const handleBoostVotes = async (idea: Idea, amount: number) => {
    setUpdatingId(idea.id);
    const newVotes = Math.max(0, idea.votes + amount);
    const { error } = await supabase.from("ideas").update({ votes: newVotes }).eq("id", idea.id);
    if (!error) {
      setIdeas((prev) => prev.map((i) => i.id === idea.id ? { ...i, votes: newVotes } : i).sort((a, b) => b.votes - a.votes));
    }
    setUpdatingId(null);
  };

  const handleVerifyUser = async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ kyc_status: 'Verified' })
      .eq('id', userId);

    if (!error) {
      loadAdminData();
    } else {
      alert("Error verifying user");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0a1f17] flex items-center justify-center p-6 text-white">
        <form onSubmit={handleLogin} className="bg-white/10 p-8 rounded-2xl border border-white/20 max-w-sm w-full space-y-4 backdrop-blur-sm">
          <ShieldAlert className="size-12 text-[#c4f080] mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-center">Admin Access</h1>
          <input
            type="password"
            placeholder="Enter Admin Passcode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-3 rounded-md bg-black/50 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#c4f080]"
          />
          <button type="submit" className="w-full bg-[#c4f080] text-[#0a1f17] font-bold h-11 rounded-md hover:bg-white transition-colors">
            Enter Dashboard
          </button>
        </form>
      </main>
    );
  }

  const totalUsers = profiles.length;
  const totalIdeas = ideas.length;
  const totalReferrals = profiles.reduce((sum, p) => sum + (p.referral_count || 0), 0);

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

      <div className="max-w-6xl mx-auto px-6 pt-12 space-y-12">
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

        {/* Startup Pipeline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-2xl font-bold text-[#1b4a3a]">Startup Pipeline</h2>
          </div>
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

        {/* User Directory & KYC */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-2xl font-bold text-[#1b4a3a]">User Directory & KYC</h2>
          </div>
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

                    {/* ID Docs Column */}
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

                    {/* KYC Status Column */}
                    <td className="px-6 py-4 text-right">
                      {profile.kyc_status === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700">
                          <CheckCircle2 className="size-3" /> Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerifyUser(profile.id)}
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
      </div>
    </main>
  );
}