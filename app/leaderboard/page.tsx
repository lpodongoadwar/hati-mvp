import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { ShareInviteButton } from "@/components/share-invite-button";
import { Lightbulb, ClipboardList, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic"; // always show fresh standings

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

/** Where "View Leaderboards" goes. Change to your real route. */
const MRR_LEADERBOARD_HREF = "/leaderboard/mrr";

/** Referrals needed for the top tier. */
const TOP_TIER_TARGET = 50;
const TOP_TIER_REWARD = 80_000;

/** Reward tiers (5 referrals is treated as part of the UGX 0 tier). */
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

/**
 * Assumes a `profiles` table with:
 *   id (uuid, = auth.users.id), full_name (text),
 *   team ('red' | 'yellow' | 'blue' | 'green'), referral_count (int)
 * Adjust the table/column names below if yours differ.
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

  const mobilisers = (rows ?? []) as Mobiliser[];
  const userId = authData.user?.id ?? null;
  const me = userId ? mobilisers.find((m) => m.id === userId) ?? null : null;

  const byTeam = TEAM_ORDER.map((key) => {
    const members = mobilisers.filter((m) => m.team === key);
    return {
      key,
      count: members.length,
      total: members.reduce((sum, m) => sum + (m.referral_count ?? 0), 0),
      top: members.slice(0, 3),
    };
  });

  return { byTeam, me };
}

/* ---------- Page ---------- */

export default async function LeaderboardPage() {
  const { byTeam, me } = await getData();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
           <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Hati Ambassadors Program
        </h1>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Standings */}
      <section className="mt-8 overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
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

          {byTeam.map(({ key, count: mobiliserCount, total, top }) => {
            const team = TEAMS[key];
            return (
              <tbody
                key={key}
                className="border-t border-neutral-200 dark:border-neutral-800"
              >
                {/* Team row */}
                <tr className={`border-l-4 bg-neutral-50/60 dark:bg-neutral-900/60 ${team.stripe}`}>
                  <th scope="rowgroup" className="px-4 py-3 text-base font-semibold">
                    {team.label}{" "}
                    <span className="font-normal text-neutral-500">({team.campus})</span>
                    <span className="ml-2 text-sm font-normal text-neutral-500">
                      · Mobilisers: {mobiliserCount}
                    </span>
                  </th>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {total.toLocaleString("en-UG")}
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-500">Team total</td>
                </tr>

                {/* Top 3 students */}
                {top.map((student, i) => {
                  const count = student.referral_count ?? 0;
                  return (
                    <tr key={student.id} className={`border-l-4 ${team.stripe}`}>
                      <td className="px-4 py-2 pl-8">
                        <span className="mr-2 inline-block w-4 text-neutral-500 tabular-nums">
                          {i + 1}.
                        </span>
                        {student.full_name ?? "Unnamed mobiliser"}
                        {me?.id === student.id && (
                          <span className="ml-2 rounded bg-neutral-900 px-1.5 py-0.5 text-xs text-white dark:bg-white dark:text-neutral-900">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">{count}</td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {formatUGX(getReward(count))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
        </table>
      </section>

            {/* Your progress */}
      <section
        aria-labelledby="your-progress"
        className="mt-8 rounded-lg border border-neutral-200 p-5 dark:border-neutral-800"
      >
        <h2 id="your-progress" className="text-lg font-semibold mb-4">
          Ambassador Hub
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Invite friends to Hati. Earn rewards, become an Ideator and participate in the Sartup Show.
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>12/50 Referrals</span>
            <span className="text-muted-foreground">Unlock rewards up to UGX 80,000</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-[#1b4a3a]" style={{ width: '24%' }}></div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">38 more to go</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Link
            href={MRR_LEADERBOARD_HREF}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            🏆 View Leaderboards
          </Link>
          <ShareInviteButton invitePath="/mobiliser/signup?ref=demo" />
        </div>
      </section>

      {/* Boost your score */}
      <section aria-labelledby="boost-score" className="mt-8">
        <h2 id="boost-score" className="text-lg font-semibold">
          Boost your score
        </h2>
        <p className="text-sm text-muted-foreground">
          Learn and earn points along the way.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#0a1f17] p-4 text-white hover:bg-[#0d2a1f]"
          >
            <div className="rounded-full bg-[#c4f080] p-2 text-[#0a1f17]">
              <Lightbulb className="size-5" />
            </div>
            <span className="text-xs font-medium">Take Quiz</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#0a1f17] p-4 text-white hover:bg-[#0d2a1f]"
          >
            <div className="rounded-full bg-[#c4f080] p-2 text-[#0a1f17]">
              <ClipboardList className="size-5" />
            </div>
            <span className="text-xs font-medium">Take Survey</span>
          </button>

          <button
            type="button"
            className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#0a1f17] p-4 text-white hover:bg-[#0d2a1f]"
          >
            <div className="rounded-full bg-[#c4f080] p-2 text-[#0a1f17]">
              <BookOpen className="size-5" />
            </div>
            <span className="text-xs font-medium">Complete Module</span>
          </button>
        </div>
      </section>

      {/* Reward tiers */}
      <section aria-labelledby="reward-tiers" className="mt-8">
        <h2 id="reward-tiers" className="text-lg font-semibold">
          Reward Tiers
        </h2>
        <ul className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
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

/* ---------- Components ---------- */

function MyProgress({ me }: { me: Mobiliser & { team: TeamKey } }) {
  const team = TEAMS[me.team];
  const count = me.referral_count ?? 0;
  const reward = getReward(count);

  return (
    <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <dt className="text-sm text-neutral-500">Your team</dt>
        <dd className="mt-1 flex items-center gap-2 text-lg font-semibold">
          <span className={`inline-block h-3 w-3 rounded-full ${team.dot}`} aria-hidden />
          {team.label} ({team.campus})
        </dd>
      </div>
      <div>
        <dt className="text-sm text-neutral-500">Your referrals</dt>
        <dd className="mt-1 text-lg font-semibold tabular-nums">{count}</dd>
      </div>
      <div>
        <dt className="text-sm text-neutral-500">Reward you qualify for</dt>
        <dd className="mt-1 text-lg font-semibold tabular-nums">{formatUGX(reward)}</dd>
      </div>
    </dl>
  );
}

function ReferralProgress({ userId, count }: { userId: string; count: number }) {
  const reachedTop = count >= TOP_TIER_TARGET;
  const percent = Math.min(100, Math.round((count / TOP_TIER_TARGET) * 100));

  return (
    <div className="mt-6 space-y-4">
      {reachedTop ? (
        <p className="rounded-md bg-[#1b4a3a]/10 p-3 text-sm font-medium text-[#1b4a3a] dark:text-[#c4f080]">
          Well done, you have reached the top tier, keep referring to maintain
          your position on the leaderboard.
        </p>
      ) : (
        <div>
          <div className="flex justify-between text-sm font-medium">
            <span>
              {count}/{TOP_TIER_TARGET} Referrals
            </span>
            <span className="text-muted-foreground">
              to unlock {formatUGX(TOP_TIER_REWARD)}
            </span>
          </div>

          <div
            className="mt-2 h-2 w-full rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={TOP_TIER_TARGET}
            aria-valuenow={count}
          >
            <div
              className="h-2 rounded-full bg-[#1b4a3a]"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {TOP_TIER_TARGET - count} more to go
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Link
          href={MRR_LEADERBOARD_HREF}
          className="flex flex-1 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          🏆 View Leaderboards
        </Link>
        <ShareInviteButton invitePath={`/mobiliser/signup?ref=${userId}`} />
      </div>
    </div>
  );
}
