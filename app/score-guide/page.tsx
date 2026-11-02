import Link from "next/link";
import { ArrowLeft, HelpCircle, ShieldCheck, TrendingUp, Building2, Lock } from "lucide-react";

export default function ScoreGuidePage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a]">Understanding Your Hati Score</h1>
          <p className="mt-2 text-lg text-gray-600">Everything you need to know about your financial identity.</p>
        </div>

        {/* Section 1: What & Why */}
        <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-border/80 pb-4">
            <HelpCircle className="size-8 text-[#1b4a3a]" />
            <h2 className="text-2xl font-semibold text-foreground">What is a Credit Score?</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            A credit score is a number that tells lenders how trustworthy you are with money. It predicts how likely you are to repay a loan based on your past financial behavior (like saving consistently and repaying past debts).
          </p>
          <div className="bg-[#fcfaf6] p-5 rounded-xl border border-[#e5e1d8]">
            <h3 className="font-semibold text-[#1b4a3a] mb-2">Why do you need one?</h3>
            <p className="text-sm text-gray-700">
              Without a credit score, banks see you as a "ghost." They will refuse to lend you money for your business, school fees, or emergencies because they can't measure your risk. Hati gives you a verified score so you can unlock loans without needing traditional collateral like land or a car.
            </p>
          </div>
        </section>

        {/* Section 2: The Tiers */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground mb-4">The Hati Tiers</h2>
          
          {/* Tier 1 */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                <Lock className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Tier I <span className="text-sm font-normal text-muted-foreground ml-2">(0 - 499)</span></h3>
            </div>
            <p className="text-sm text-gray-700"><strong>How to qualify:</strong> Sign up, verify your NIN, and complete your first financial literacy modules.</p>
            <p className="text-sm text-gray-700"><strong>Benefits:</strong> Access to the Hati Ambassadors Program to earn rewards, and a clear roadmap to build your financial identity.</p>
          </div>

          {/* Tier 2 */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                <TrendingUp className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Tier II <span className="text-sm font-normal text-muted-foreground ml-2">(500 - 649)</span></h3>
            </div>
            <p className="text-sm text-gray-700"><strong>How to qualify:</strong> Consistently save via the "Save With Every Purchase" model, complete all surveys, and maintain a high leaderboard ranking.</p>
            <p className="text-sm text-gray-700"><strong>Benefits:</strong> Unlock micro-loans from partner banks, qualify for Hati Travel rewards, and get access to financial coaching.</p>
          </div>

          {/* Tier 3 */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-700">
                <Building2 className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Tier III <span className="text-sm font-normal text-muted-foreground ml-2">(650 - 850)</span></h3>
            </div>
            <p className="text-sm text-gray-700"><strong>How to qualify:</strong> Prove you have multiple income streams (e.g., a job + a side business), complete the full curriculum, and maintain high financial discipline.</p>
            <p className="text-sm text-gray-700"><strong>Benefits:</strong> Unlock the <strong>Ideator Status</strong>. You can pitch your business on the Hati Startup Show for up to $100K in VC funding, and access larger enterprise loans.</p>
          </div>
        </section>

      </div>
    </main>
  );
}