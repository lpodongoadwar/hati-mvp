import Link from "next/link";
import { ArrowLeft, Users, Lightbulb, ClipboardList, BookOpen, Target } from "lucide-react";

export default function ParticipatePage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a]">How to Participate</h1>
          <p className="mt-2 text-lg text-gray-600">Choose your path to build your credit score and unlock rewards.</p>
        </div>

        {/* Section 1: The Campus Blitz & Ambassadors Program */}
        <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <Users className="size-8 text-[#1b4a3a]" />
            <h2 className="text-2xl font-semibold text-foreground">The Campus Blitz & Ambassadors Program</h2>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">What they are?</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              The Campus Blitz is a 4-month national competition. One can become a Mobilizer by directing their peers to join Hati and complete their financial literacy modules. You compete for a dynamic prize pool funded by our enterprise partners. The top mobilizers on the leaderboard win cash prizes (up to UGX 80,000) and fast-track their way to the Startup Pipeline.
            </p>
            <h3 className="font-semibold text-lg text-foreground pt-2">How to Join</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Sign up, get your unique referral link, and start climbing the leaderboard.
            </p>
            <Link href="/leaderboard" className="inline-flex items-center justify-center rounded-md bg-[#1b4a3a] px-6 py-2 text-sm font-medium text-white hover:bg-[#153a2e] transition-colors mt-2">
              View the Leaderboard & Get Your Link
            </Link>
          </div>
        </section>

        {/* Section 2: Boost Your Score */}
        <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <Target className="size-8 text-[#1b4a3a]" />
            <h2 className="text-2xl font-semibold text-foreground">Boost Your Score</h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            Your Hati Trust Score is built on your financial behavior. Complete these tasks to increase your score and unlock higher tiers of credit.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Quiz */}
            <div className="flex flex-col items-center text-center p-4 border rounded-xl space-y-3">
              <div className="bg-[#c4f080] p-3 rounded-full text-[#0a1f17]">
                <Lightbulb className="size-6" />
              </div>
              <h4 className="font-semibold text-foreground">Take Quiz</h4>
              <p className="text-xs text-gray-600">Test your financial knowledge to earn points.</p>
              <Link href="/quiz-example" className="text-sm font-medium text-[#1b4a3a] underline mt-auto">Start Quiz</Link>
            </div>

            {/* Survey */}
            <div className="flex flex-col items-center text-center p-4 border rounded-xl space-y-3">
              <div className="bg-[#c4f080] p-3 rounded-full text-[#0a1f17]">
                <ClipboardList className="size-6" />
              </div>
              <h4 className="font-semibold text-foreground">Take Survey</h4>
              <p className="text-xs text-gray-600">Share your spending habits to refine your profile.</p>
              <Link href="/survey-example" className="text-sm font-medium text-[#1b4a3a] underline mt-auto">Start Survey</Link>
            </div>

            {/* Module */}
            <div className="flex flex-col items-center text-center p-4 border rounded-xl space-y-3">
              <div className="bg-[#c4f080] p-3 rounded-full text-[#0a1f17]">
                <BookOpen className="size-6" />
              </div>
              <h4 className="font-semibold text-foreground">Complete Module</h4>
              <p className="text-xs text-gray-600">Learn how to manage money and build wealth.</p>
              <Link href="/module-example" className="text-sm font-medium text-[#1b4a3a] underline mt-auto">Start Module</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}