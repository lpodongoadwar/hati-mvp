import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { createClient } from "@/lib/db";

export const dynamic = "force-dynamic"; 

type TeamKey = "red" | "yellow" | "blue" | "green" | "orange" | "purple";

const TEAMS: Record<TeamKey, { label: string; campus: string; dot: string }> = {
  red: { label: "Red", campus: "MAK", dot: "bg-red-600" },
  yellow: { label: "Yellow", campus: "VU", dot: "bg-yellow-400" },
  blue: { label: "Blue", campus: "MUBS", dot: "bg-blue-600" },
  green: { label: "Green", campus: "KIU", dot: "bg-green-600" },
  orange: { label: "Orange", campus: "KYU", dot: "bg-orange-500" },
  purple: { label: "Purple", campus: "IUEA", dot: "bg-purple-600" },
};

type Mobiliser = {
  id: string;
  full_name: string | null;
  team: string | null; // Changed to string to accept "individual"
  referral_count: number | null;
};

async function getData() {
  const supabase = await createClient();

  const [{ data: rows }, { data: authData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, team, referral_count")
      // REMOVED the .not("team", "is", null) so Individual users show up
      .order("referral_count", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const mobilisers = ((rows ?? []) as Mobiliser[]).sort(
    (a, b) =>
      (b.referral_count ?? 0) - (a.referral_count ?? 0) ||
      (a.full_name ?? "").localeCompare(b.full_name ?? "")
  );

  return { mobilisers, userId: authData.user?.id ?? null };
}

export default async function IndividualLeaderboardPage() {
  const { mobilisers, userId } = await getData();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <Link 
          href="/leaderboard" 
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 size-4" /> Back to Team Standings
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-[#1b4a3a] flex items-center gap-3">
          <Trophy className="size-8 text-yellow-500" /> Individual Leaderboard
        </h1>
        <p className="mt-2 text-muted-foreground">Top mobilizers across all teams and individuals ranked by total referrals.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border/80 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-muted-foreground border-b border-border/80">
            <tr>
              <th className="px-6 py-4 font-medium w-16">Rank</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Affiliation</th>
              <th className="px-6 py-4 font-medium text-right">Referrals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/80">
            {mobilisers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                  No mobilizers on the leaderboard yet.
                </td>
              </tr>
            ) : (
              mobilisers.map((m, i) => {
                // Check if they are in a university team, or just an individual
                const team = m.team && m.team !== "individual" ? TEAMS[m.team as TeamKey] : null;
                const isMe = userId === m.id;

                return (
                  <tr 
                    key={m.id} 
                    className={`hover:bg-muted/20 ${isMe ? "bg-muted/30" : ""}`}
                  >
                    <td className="px-6 py-4 font-bold text-muted-foreground tabular-nums">
                      #{i + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {m.full_name ?? "Anonymous User"}
                      {isMe && (
                        <span className="ml-2 rounded bg-[#1b4a3a] px-1.5 py-0.5 text-[10px] uppercase text-white">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {team ? (
                        <span className="inline-flex items-center gap-2">
                          <span className={`inline-block h-3 w-3 rounded-full ${team.dot}`} aria-hidden />
                          <span className="font-medium text-foreground">{team.label}</span>
                          <span className="text-muted-foreground">({team.campus})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <span className="inline-block h-3 w-3 rounded-full bg-gray-400" aria-hidden />
                          <span className="font-medium text-foreground">Individual</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold tabular-nums text-[#1b4a3a]">
                      {(m.referral_count ?? 0).toLocaleString("en-UG")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}