import Link from "next/link";
import { ArrowLeft, ShoppingBag, ShieldCheck, Target, TrendingUp } from "lucide-react";

export default function LearnMorePage() {
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
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a]">
            The Hati Ecosystem
          </h1>
          <p className="text-xl font-medium text-gray-700">
            Why we are building more than just a credit score.
          </p>
        </div>

        {/* The Justification */}
        <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-4">
            <Target className="size-8 text-[#1b4a3a]" />
            <h2 className="text-2xl font-semibold text-foreground">The Justification</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Financial literacy must be combined with capital. We realized that giving someone a credit score is only step one. To actually change their financial trajectory, they need places to save, tools to protect their wealth, and rewards for their discipline. The Hati Trust Score is the engine, but the ecosystem is the vehicle.
          </p>
        </section>

        {/* The Mechanics */}
        <div className="grid gap-6">
          {/* Market */}
          <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#1b4a3a]/10 p-2 rounded-lg text-[#1b4a3a]">
                <ShoppingBag className="size-6" />
              </div>
              <h2 className="text-2xl font-semibold text-[#1b4a3a]">Hati Market</h2>
            </div>
            <h3 className="font-semibold text-lg">Save With Every Transaction</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              When you buy goods from a local vendor using Hati, you can pay a little extra on the transaction (e.g., UGX 500), it is automatically swept into your locked savings vault. This builds your collateral in the background, which can then be used to access credit. We don't ask you to change your spending habits; we just help you save while you do it.
            </p>
          </section>

            {/* Hati Score Index */}
          <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#1b4a3a]/10 p-2 rounded-lg text-[#1b4a3a]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                  <path d="M12 2v4"/>
                  <path d="M12 18v4"/>
                  <path d="m4.93 4.93 2.83 2.83"/>
                  <path d="m16.24 16.24 2.83 2.83"/>
                  <path d="M2 12h4"/>
                  <path d="M18 12h4"/>
                  <path d="m4.93 19.07 2.83-2.83"/>
                  <path d="m16.24 7.76 2.83-2.83"/>
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#1b4a3a]">Hati Score Index</h2>
            </div>
            
            <h3 className="font-semibold text-lg">Formalizing the Invisible</h3>
            
            <p className="text-gray-700 leading-relaxed text-sm">
              The Hati Score Index is the infrastructure layer designed to formalize the invisible, underbanked informal sector of Uganda. By aggregating alternative financial data and behavioral insights, we create a unified credit identity that allows banks, SACCOs, and syndicated lenders to confidently underwrite thin-file users.
            </p>
          </section>
        </div>

          {/* Insurance */}
          <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#1b4a3a]/10 p-2 rounded-lg text-[#1b4a3a]">
                <ShieldCheck className="size-6" />
              </div>
              <h2 className="text-2xl font-semibold text-[#1b4a3a]">Hati Insurance</h2>
            </div>
            <h3 className="font-semibold text-lg">Protect What You Build</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              We act as an aggregator, connecting you to licensed insurers. Whether it's micro life cover, health emergency coverage, or crop insurance for your Group-Based Enterprise (GBE), we offer affordable premiums embedded directly into your Hati Wallet. As your credit score grows, your insurance premiums drop.
            </p>
          </section>

        <div className="bg-[#1b4a3a] text-white p-8 rounded-2xl shadow-md space-y-4 text-center">
          <TrendingUp className="size-10 text-[#c4f080] mx-auto" />
          <h2 className="text-2xl font-bold">Your Credit Score Unlocks It All</h2>
          <p className="text-white/80 text-sm max-w-lg mx-auto">
            Every module you complete, every survey you take, and every friend you refer increases your Hati Trust Score. The higher your score, the more of the ecosystem opens up to you.
          </p>
          <Link href="/participate" className="inline-block mt-4 bg-[#c4f080] text-[#0a1f17] font-semibold px-6 py-3 rounded-md hover:bg-white transition-colors">
            Start Building Your Score
          </Link>
        </div>
      </div>
    </main>
  );
}