import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, ClipboardList, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

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

/* ---------- Data ---------- */

type Mobiliser = {
  id: string;
  full_name: string | null;
  team: TeamKey | null;
  referral_count: number | null;
};

async function getData() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("profiles")
    .select("id, full_name, team, referral_count")
    .not("team", "is", null)
    .order("referral_count", { ascending: false });

  const mobilisers = (rows ?? []) as Mobiliser[];

  const byTeam = TEAM_ORDER.map((key) => {
    const members = mobilisers.filter((m) => m.team === key);
    return {
      key,
      total: members.reduce((sum, m) => sum + (m.referral_count ?? 0), 0),
      top: members.slice(0, 3),
      count: members.length,
    };
  });

  return { byTeam };
}

/* ---------- Page ---------- */

export default async function LeaderboardPage() {
  const { byTeam } = await getData();

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
      </section>

      {/* Standings Table */}
      <section className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 mb-10">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="border-b border-neutral-200 px-4 py-3 text-left text-base font-semibold dark:border-neutral-800">
            Standings
          </caption>
          <thead className="bg-neutral-50 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">Team / University</th>
              <th scope="col" className="px-4 py-2 text-right font-medium">Referrals</th>
              <th scope="col" className="px-4 py-2 text-right font-medium">Reward</th>
            </tr>
          </thead>

          {byTeam.map(({ key, total, top, count }) => {
            const team = TEAMS[key];
            return (
              <tbody key={key} className="border-t border-neutral-200 dark:border-neutral-800">
                <tr className={`border-l-4 bg-neutral-50/60 dark:bg-neutral-900/60 ${team.stripe}`}>
                  <th scope="rowgroup" className="px-4 py-3 text-base font-semibold">
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
                          {student.full_name ?? "Unnamed mobiliser"}
                        </td>
                        <td className="px-4 py-2 text-right tabular-nums">{studentCount}</td>
                        <td className="px-4 py-2 text-right tabular-nums">{formatUGX(getReward(studentCount))}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            );
          })}
        </table>
      </section>

      {/* Ambassadors Hub */}
      <section className="mt-8 rounded-lg border border-neutral-200 p-5 dark:border-neutral-800 mb-8 bg-card">
        <h2 className="text-lg font-semibold mb-4">Ambassador Hub</h2>
        <p className="text-sm text-muted-foreground mb-4">Invite friends to Hati and earn rewards as they join.</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>12/50 Referrals</span>
            <span className="text-muted-foreground">to unlock $20</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-[#1b4a3a]" style={{ width: '24%' }}></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">38 more to go</p>
        </div>

        <div className="flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted">
            🏆 View Leaderboards
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-4 py-2 text-sm font-medium text-white hover:bg-[#153a2e]">
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
  <div className="rounded-full bg-[#c4f080] p-2 text-[#0a1f17]">
    <ClipboardList className="size-5" />
  </div>
  <span className="text-xs font-medium">Take Survey</span>
</Link>
         <Link href="/curriculum" className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#0a1f17] p-4 text-white hover:bg-[#0d2a1f]">
  <div className="rounded-full bg-[#c4f080] p-2 text-[#0a1f17]"><BookOpen className="size-5" /></div>
  <span className="text-xs font-medium">Complete Module</span>
</Link>
        </div>
      </section>

      {/* Reward Tiers */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Reward Tiers</h2>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
          <li>0–5 referrals: UGX 0</li>
          <li>6–14 referrals: UGX 20,000</li>
          <li>15–29 referrals: UGX 40,000</li>
          <li>30–49 referrals: UGX 60,000</li>
          <li>50 or more referrals: UGX 80,000</li>
        </ul>
      </section>
    </main>
  );
}