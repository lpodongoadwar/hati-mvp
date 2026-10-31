import Link from "next/link";
import { Lightbulb, Trophy, Target, TrendingUp } from "lucide-react";

export function LeaderboardHero() {
  return (
    <section className="mb-12 bg-[#fcfaf6] border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-[#1b4a3a]">
          The Hati Ambassadors Program
        </h1>
        <p className="text-lg font-medium text-gray-800">
          Promoting financial literacy and inclusion to unlock access to credit.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          The Ambassadors Program is designed to help you build a verifiable financial identity. By referring peers, completing financial literacy modules, and saving on the platform, you boost your <strong>Hati Trust Score</strong>. A higher score unlocks better credit access, lower insurance premiums, and eventually, entry into the Startup Pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="bg-white p-4 rounded-xl border space-y-2">
          <div className="flex items-center gap-2 text-[#1b4a3a] font-semibold">
            <Target className="size-5" /> 1. Mobilize & Learn
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            Refer friends to your university team, complete the modules, and climb the leaderboard to earn cash rewards and boost your score.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-4 rounded-xl border space-y-2">
          <div className="flex items-center gap-2 text-[#1b4a3a] font-semibold">
            <Trophy className="size-5" /> 2. Become a Champion
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            The top Mobilizers (Club Champions, Top Public Votes, and University Nominees) unlock the <strong>Ideator</strong> status.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-4 rounded-xl border space-y-2">
          <div className="flex items-center gap-2 text-[#1b4a3a] font-semibold">
            <TrendingUp className="size-5" /> 3. Pitch to VCs
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            As an Ideator, you pitch your 1-minute video on the <strong>Hati Startup Show</strong> to compete for up to $2M in VC and Angel funding.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm font-medium text-gray-700">
          Ready to pitch your idea? Unlock the Ideator track.
        </p>
        <Link 
          href="/ideator" 
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-6 py-2 text-sm font-medium text-white hover:bg-[#153a2e] transition-colors w-full sm:w-auto"
        >
          <Lightbulb className="size-4" />
          Go to the Startup Show
        </Link>
      </div>

    </section>
  );
}