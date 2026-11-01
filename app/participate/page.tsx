import Link from "next/link";
import { ArrowLeft, ClipboardList, BookOpen, Target, History, TrendingUp } from "lucide-react";

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
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a]">How to Build Your Score</h1>
          <p className="mt-2 text-lg text-gray-600">Complete these core activities to prove your financial discipline and unlock credit.</p>
        </div>

        {/* Section 1: The Mechanics */}
        <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <Target className="size-8 text-[#1b4a3a]" />
            <h2 className="text-2xl font-semibold text-foreground">The Four Pillars of Your Score</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              Your Hati Trust Score isn't just about how much money you have—it's about how you manage it and prove your ability to generate it. We use four tools to measure your financial behavior:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li><strong>Modules:</strong> Short lessons on financial literacy. They teach you how to budget, save, and avoid predatory debt.</li>
              <li><strong>Quizzes:</strong> Quick tests to prove you understood the modules. Getting answers right earns you points.</li>
              <li><strong>Surveys:</strong> Questions about your spending habits and goals. This helps us understand your cash flow and tailor credit products to your reality.</li>
              <li><strong>Transaction History:</strong> Proof of your ability to generate and manage cash flow. We analyze your mobile money mini-statements to verify your income streams and financial capacity.</li>
            </ul>
            <p className="text-gray-700 text-sm leading-relaxed mt-4">
              The more consistently you engage with these tools, the higher your score climbs, and the more you unlock the rest of the Hati ecosystem.
            </p>
          </div>
        </section>

        {/* Section 2: Score to Ambassadors Program Link */}
        <section className="bg-[#fcfaf6] p-8 rounded-2xl border border-[#e5e1d8] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#1b4a3a]/10 p-2 rounded-lg text-[#1b4a3a]">
              <TrendingUp className="size-6" />
            </div>
            <h2 className="text-2xl font-semibold text-[#1b4a3a]">Your Score Complements the Ambassadors Program & Opens the Path to the Ideator Pipeline</h2>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Building your score complements your work in the Hati Ambassadors Program. As your score climbs, you unlock the ability to become an Ideator. Top Mobilizers earn cash rewards from the prize pool and, ultimately, unlock the <strong>Ideator</strong> status to pitch for VC funding on the Hati Startup Show.
          </p>
          <div className="pt-2">
            <Link 
              href="/leaderboard" 
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#153a2e] transition-colors"
            >
              Explore the Ambassadors Program
            </Link>
          </div>
        </section>

        {/* Section 3: The Tools (Quiz Button Removed, 2-Column Grid) */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Start Building Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Survey */}
            <div className="flex flex-col items-center text-center p-6 bg-card border border-border/80 rounded-xl shadow-sm space-y-3">
              <div className="bg-[#c4f080] p-3 rounded-full text-[#0a1f17]">
                <ClipboardList className="size-6" />
              </div>
              <h4 className="font-semibold text-foreground text-lg">Take a Survey</h4>
              <p className="text-xs text-gray-600 flex-1">Share your spending habits to refine your profile and score.</p>
             <Link href="/survey" className="...">
  Start Survey
</Link>
            </div>

            {/* Module */}
            <div className="flex flex-col items-center text-center p-6 bg-card border border-border/80 rounded-xl shadow-sm space-y-3">
              <div className="bg-[#c4f080] p-3 rounded-full text-[#0a1f17]">
                <BookOpen className="size-6" />
              </div>
              <h4 className="font-semibold text-foreground text-lg">Complete a Module</h4>
              <p className="text-xs text-gray-600 flex-1">Learn how to manage money and build long-term wealth.</p>
             <Link href="/curriculum" className="...">
  Start Module
</Link>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}