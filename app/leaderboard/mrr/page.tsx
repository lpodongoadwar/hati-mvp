import Link from "next/link";
import { createClient } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // always show fresh rankings

/* ---------- Config ---------- */

type TeamKey = "red" | "yellow" | "blue" | "green" | "orange" | "purple";

const TEAMS: Record<TeamKey, { label: string; campus: string; dot: string }> = {
  red: { label: "Red", campus: "MAK", dot: "bg-red-600" },
  yellow: { label: "Yellow", campus: "VU", dot: "bg-yellow-400" },
  blue: { label: "Blue", campus: "MUBS", dot: "bg-blue-600" },
  green: { label: "Green", campus: "KIU", dot: "bg-green-600" },
  orange: { label: "Orange", campus: "KYU", dot: "bg-orange-500" },
  purple: { label: "Purple", campus: "IUEA", dot: "bg-purple-600" },
};

/* ---------- Data ---------- */

type Mobiliser = {
  id: string;
  full_name: string | null;
  team: TeamKey | null;
  referral_count: number | null;
};

/**
 * Same `profiles` table as the main leaderboard:
 *   id (uuid, = auth.users.id), full_name (text),
 *   team ('red' | 'yellow' | 'blue' | 'green' | 'orange' | 'purple'),
 *   referral_count (int)
 */
async function getData() {
  const supabase = await createClient();

  const [{ data: rows }, { data: authData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, team, referral_count")
      .not("team", "is", null)
      .order("referral_count", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  // Highest referrals first; ties are broken alphabetically so the order is stable.
  const mobilisers = ((rows ?? []) as Mobiliser[]).sort(
    (a, b) =>
      (b.referral_count ?? 0) - (a.referral_count ?? 0) ||
      (a.full_name ?? "").localeCompare(b.full_name ?? "")
  );

  return { mobilisers, userId: authData.user?.id ?? null };
}

/* ---------- Page ---------- */

export default async function IndividualLeaderboardPage() {
  const { mobilisers, userId } = await getData();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <Link
        href="/leaderboard"
        className="text-sm text-muted-foreground underline-offset-2 hover:underline"
      >
        ← Back to Team Standings
      </Link>

      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Hati Campus Blitz
      </h1>

      <section className="mt-8 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="border-b border-neutral-200 px-4 py-3 text-left text-base font-semibold dark:border-neutral-800">
            Individual Leaderboard
          </caption>

          <thead className="bg-neutral-50 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th scope="col" className="w-16 px-4 py-2 font-medium">Rank</th>
              <th scope="col" className="px-4 py-2 font-medium">Name</th>
              <th scope="col" className="px-4 py-2 font-medium">Team</th>
              <th scope="col" className="px-4 py-2 text-right font-medium">
                Total Referrals
              </th>
            </tr>
          </thead>

          <tbody>
            {mobilisers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-neutral-500">
                  No mobilisers yet.
                </td>
              </tr>
            ) : (
              mobilisers.map((m, i) => {
                const team = m.team ? TEAMS[m.team] : null;
                const isMe = userId === m.id;

                return (
                  <tr
                    key={m.id}
                    className={`border-t border-neutral-200 dark:border-neutral-800 ${
                      isMe ? "bg-neutral-50 dark:bg-neutral-900" : ""
                    }`}
                  >
                    <td className="px-4 py-3 tabular-nums text-neutral-500">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3">
                      {m.full_name ?? "Unnamed mobiliser"}
                      {isMe && (
                        <span className="ml-2 rounded bg-neutral-900 px-1.5 py-0.5 text-xs text-white dark:bg-white dark:text-neutral-900">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {team ? (
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={`inline-block h-3 w-3 rounded-full ${team.dot}`}
                            aria-hidden
                          />
                          {team.label}{" "}
                          <span className="text-neutral-500">({team.campus})</span>
                        </span>
                      ) : (
                        <span className="text-neutral-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">
                      {(m.referral_count ?? 0).toLocaleString("en-UG")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
