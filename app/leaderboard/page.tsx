"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/db";
import { TeamSelector } from "@/components/team-selector";
import { ArrowLeft, ClipboardList, BookOpen } from "lucide-react";

/* ---------- Config ---------- */

type TeamKey = "red" | "yellow" | "blue" | "green" | "orange" | "purple";

const TEAMS: Record<TeamKey, { label: string; campus: string; stripe: string; dot: string }> = {
  red: { label: "Red", campus: "MAK", stripe: "border-l-red-600", dot: "bg-red-600" },
  yellow: { label: "Yellow", campus: "VU", stripe: "border-l-yellow-400", dot: "bg-yellow-400" },
  blue: { label: "Blue", campus: "MUBS", stripe: "border-l-blue-600", dot: "bg-blue-600" },
  green: { label: "Green", campus: "KIU", stripe: "border-l-green-600", dot: "bg-green-600" },
  orange: { label: "Orange", campus: "KYU", stripe: "border-l-orange-500", dot: "bg-orange-500" },
  purple: { label: "Purple", campus: "IUEA", stripe: "border-l-purple-600", dot: "bg-purple-600" },
};

const TEAM_ORDER: TeamKey[] = ["red", "yellow", "blue", "green", "orange", "purple"];
const TOP_TIER_TARGET = 50;
const TOP_TIER_REWARD = 80_000;

const TIERS = [
  { min: 6, reward: 20_000 },
  { min: 15, reward: 40_000 },
  { min: 30, reward: 60_000 },
  { min: TOP_TIER_TARGET, reward: TOP_TIER_REWARD },
];

function getReward(referrals: number): number {
  let reward = 0;
  for (const tier of TIERS) {
    if (referrals >= tier.min) reward = tier.reward;
  }
  return reward;
}

const formatUGX = (amount: number) => `UGX ${amount.toLocaleString("en-UG")}`;

/* ---------- Data Types ---------- */

type Mobiliser = {
  id: string;
  username: string | null;
  full_name: string | null;
  team: TeamKey | null;
  referral_count: number | null;
};

type TeamData = {
  key: TeamKey;
  total: number;
  top: Mobiliser[];
  count: number;
};

export default function LeaderboardPage() {
  const supabase = createClient();
  
   const [userId, setUserId] = useState<string | null>(null);
  const [myReferrals, setMyReferrals] = useState(0); // NEW STATE
  const [byTeam, setByTeam] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    // 1. Get current user AND their referral count
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("profiles")
          .select("referral_count")
          .eq("id", user.id)
          .single();
        if (data) setMyReferrals(data.referral_count || 0);
      }
    }
    getProfile();

    // 2. Fetch leaderboard data
    async function fetchData() {
      const { data: rows } = await supabase
        .from("profiles")
        .select("id, username, full_name, team, referral_count")
        .order("referral_count", { ascending: false });

      const mobilisers = (rows ?? []) as Mobiliser[];

      const mappedTeams = TEAM_ORDER.map((key) => {
        const members = mobilisers.filter((m) => m.team === key);
        return {
          key,
          total: members.reduce((sum, m) => sum + (m.referral_count ?? 0), 0),
          top: members.slice(0, 3),
          count: members.length,
        };
      });

      // DYNAMIC SORTING: Sort teams by total referrals
      mappedTeams.sort((a, b) => b.total - a.total);

      setByTeam(mappedTeams);
      setLoading(false);
    }
    
    fetchData();
  }, [supabase]); // <--- This closing bracket is now correct
  const handleShare = async () => {
    if (!userId) return alert("Please log in to share your link.");
    
    const inviteLink = `${window.location.origin}/?ref=${userId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my team on Hati',
          text: 'Help me climb the leaderboard and build your credit score.',
          url: inviteLink,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied to clipboard!");
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
          Hati Ambassadors Program
        </h1>
        <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Hero Section */}
      <section className="space-y-6 mb-10">
        <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-sm space-y-6">
          
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-[#1b4a3a]">The Mobilizer Pipeline</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              The Hati Ambassadors Program is built on one core belief: <strong>financial literacy without capital is just an opinion.</strong> We are here to promote financial inclusion by helping you build a verified credit score, unlock access to formal credit, and learn how to manage wealth. 
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              By climbing the Mobilizer leaderboard, you are not just earning rewards—you are proving your financial discipline while promoting financial literacy and inclusion by expanding the network of the financially literate and creditworthy. The top Mobilizers (Club Champions, Top Public Votes, and University Nominees) will unlock the <strong>Ideator</strong> status, giving them a direct pathway to pitch for VC funding.
            </p>
          </div>

          <div className="bg-[#fcfaf6] p-5 rounded-xl border border-[#e5e1d8] space-y-3">
            <h3 className="font-semibold text-[#1b4a3a]">The Hati Startup Show</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              The Startup Show is our flagship event where the best Ideators pitch live to a panel of Venture Capitalists and Angel Investors. They will deploy up to <strong>$2M in funding</strong> across the top pitches. To get there, you must first prove yourself as a Mobilizer. 
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>The Club Champions:</strong> The top 5 mobilizers across all teams. To qualify through this track, one must have a Tier I-II Hati Trust Score, join a team, complete all surveys and modules, and get at least the second tier of rewards.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>The University Nominees:</strong> The 10 mobilizers from the top 3 universities. 5 from university #1, 3 from university #2 and 2 from university #3. To qualify through this track, one must be nominated by their university.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>The Top Public Candidates:</strong> The top 5 individual mobilizers voted by the community. To qualify through this track, one must have a Tier III Hati Trust Score, complete all surveys and modules, and get at least the fourth tier of rewards. 
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>The next best 30 candidates:</strong> Voted by the public, will get to pitch to Angel Investors under dynamic terms.
            </p>
            <div className="pt-2">
              <Link 
                href="/ideator" 
                className="inline-flex items-center justify-center rounded-md bg-[#1b4a3a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#153a2e] transition-colors"
              >
                Go to the Ideator Pipeline
              </Link>
            </div>
          </div>

        </div>
        <TeamSelector />
      </section>

      {/* Standings Table */}
      <section className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 mb-10">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="border-b border-neutral-200 px-4 py-3 text-left text-base font-semibold dark:border-neutral-800">
            Standings
          </caption>
          <thead className="bg-neutral-50 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">Rank / Team</th>
              <th scope="col" className="px-4 py-2 text-right font-medium">Referrals</th>
              <th scope="col" className="px-4 py-2 text-right font-medium">Reward</th>
            </tr>
          </thead>

          {loading ? (
            <tbody>
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">Loading standings...</td>
              </tr>
            </tbody>
          ) : (
            byTeam.map(({ key, total, top, count }, index) => {
              const team = TEAMS[key];
              return (
                <tbody key={key} className="border-t border-neutral-200 dark:border-neutral-800">
                  <tr className={`border-l-4 bg-neutral-50/60 dark:bg-neutral-900/60 ${team.stripe}`}>
                    <th scope="rowgroup" className="px-4 py-3 text-base font-semibold">
                      <span className="text-muted-foreground mr-2">#{index + 1}</span>
                      {team.label} <span className="font-normal text-neutral-500">({team.campus})</span>
                      <span className="ml-2 text-xs font-normal text-neutral-500">- {count} Mobilizers</span>
                    </th>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{total.toLocaleString("en-UG")}</td>
                    <td className="px-4 py-3 text-right text-neutral-500">Team total</td>
                  </tr>

                  {top.length === 0 ? (
                    <tr className={`border-l-4 ${team.stripe}`}>
                      <td colSpan={3} className="px-4 py-3 pl-8 text-neutral-500">No mobilisers on this team yet.</td>
                    </tr>
                  ) : (
                    top.map((student, i) => {
                      const studentCount = student.referral_count ?? 0;
                      return (
                        <tr key={student.id} className={`border-l-4 ${team.stripe}`}>
                          <td className="px-4 py-2 pl-8">
                            <span className="mr-2 inline-block w-4 text-neutral-500 tabular-nums">{i + 1}.</span>
                            {/* Show username, fallback to full name */}
                            {student.username || student.full_name || "Anonymous"}
                          </td>
                          <td className="px-4 py-2 text-right tabular-nums">{studentCount}</td>
                          <td className="px-4 py-2 text-right tabular-nums">{formatUGX(getReward(studentCount))}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              );
            })
          )}
        </table>
      </section>

           {/* Ambassadors Hub */}
      <section className="mt-8 rounded-lg border border-neutral-200 p-5 dark:border-neutral-800 mb-8 bg-card">
        <h2 className="text-lg font-semibold mb-4">Ambassador Hub</h2>
        <p className="text-sm text-muted-foreground mb-4">Invite friends to Hati and earn rewards as they join.</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium mb-2">
            {/* DYNAMIC NUMBERS */}
            <span>{myReferrals}/50 Referrals</span>
            <span className="text-muted-foreground">to unlock rewards up to UGX 80,000</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            {/* DYNAMIC PROGRESS BAR WIDTH (Max 100%) */}
            <div 
              className="h-2 rounded-full bg-[#1b4a3a] transition-all duration-500" 
              style={{ width: `${Math.min((myReferrals / 50) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {myReferrals >= 50 ? "You have reached the top tier!" : `${50 - myReferrals} more to go`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link 
            href="/leaderboard/mrr" 
            className="flex flex-1 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            🏆 View Leaderboards
          </Link>
          <button 
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-4 py-2 text-sm font-medium text-white hover:bg-[#153a2e] transition-colors"
          >
            🔗 Share Invite Link
          </button>
        </div>
      </section>

      {/* Boost Your Score */}
      <section className="mt-8 mb-8">
        <h2 className="text-lg font-semibold">Boost your score</h2>
        <p className="text-sm text-muted-foreground mb-4">Learn and earn points along the way.</p>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/survey" className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#0a1f17] p-4 text-white hover:bg-[#0d2a1f] transition-colors">
            <div className="rounded-full bg-[#c4f080] p-2 text-[#1b4a3a]">
              <ClipboardList className="size-5" />
            </div>
            <span className="text-xs font-medium">Take Survey</span>
          </Link>
          <Link href="/curriculum" className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#0a1f17] p-4 text-white hover:bg-[#0d2a1f] transition-colors">
            <div className="rounded-full bg-[#c4f080] p-2 text-[#1b4a3a]"><BookOpen className="size-5" /></div>
            <span className="text-xs font-medium">Complete Module</span>
          </Link>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Reward Tiers</h2>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
          <li>1. 0–5 referrals: UGX 0</li>
          <li>2. 6–14 referrals: UGX 20,000</li>
          <li>3. 15–29 referrals: UGX 40,000</li>
          <li>4. 30–49 referrals: UGX 60,000</li>
          <li>5. 50 or more referrals: UGX 80,000</li>
        </ul>
      </section>
    </main>
  );
}