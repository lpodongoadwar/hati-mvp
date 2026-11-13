import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a]">Frequently Asked Questions</h1>
          <p className="mt-2 text-lg text-gray-600">Everything you need to know about Hati, SWET, and the Startup Show.</p>
        </div>

        <div className="space-y-8">
          {/* Question 1 */}
          <section id="what-is-hati" className="bg-card p-6 rounded-xl border border-border/80 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1b4a3a] mb-2">What is Hati?</h2>
            <p className="text-gray-700 leading-relaxed">
              Hati is the financial infrastructure for East Africa's informal economy. We turn everyday purchases into locked savings, and locked savings into verified credit scores. We don't just score the unbanked; we build the data and collateral that makes them bankable.
            </p>
          </section>

          {/* Question 2 */}
          <section id="swet-model" className="bg-card p-6 rounded-xl border border-border/80 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1b4a3a] mb-2">How does the "Save With Every Transaction" (SWET) model work?</h2>
            <p className="text-gray-700 leading-relaxed">
              When you buy goods at a Hati-partnered vendor, a small micro-levy (e.g., UGX 100) is automatically added to your transaction. This money doesn't go to Hati; it goes directly into your locked SWET vault. As you shop, you build collateral and prove your financial discipline, which unlocks higher credit tiers.
            </p>
          </section>

          {/* Question 3 */}
          <section id="is-it-free" className="bg-card p-6 rounded-xl border border-border/80 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1b4a3a] mb-2">Is Hati free to use?</h2>
            <p className="text-gray-700 leading-relaxed">
              Yes. The core Hati platform, including your credit score dashboard and financial literacy modules, is completely free. We generate revenue through enterprise partnerships, vendor transaction fees, and credit pulls (when banks pay to see your score). We do not charge students or individuals to build their financial identity.
            </p>
          </section>

          {/* Question 4 */}
          <section id="ambassadors" className="bg-card p-6 rounded-xl border border-border/80 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1b4a3a] mb-2">How do I earn in the Ambassadors Program?</h2>
            <p className="text-gray-700 leading-relaxed">
              The Ambassadors Program is a gamified competition. You earn rewards by completing financial literacy modules, referring peers to the platform, and taking surveys. The top Mobilizers on the leaderboard unlock cash prizes (funded by our enterprise partners) and the coveted "Ideator" status.
            </p>
          </section>

          {/* Question 5 */}
          <section id="startup-show" className="bg-card p-6 rounded-xl border border-border/80 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1b4a3a] mb-2">How do I get VC funding on the Startup Show?</h2>
            <p className="text-gray-700 leading-relaxed">
              To pitch for VC funding, you must first build your Hati Trust Score and qualify as an Ideator. Once qualified, you submit a 1-minute video pitch. The top pitches are selected by the community and our judges to appear on the Hati Startup Show, where they pitch live to top Venture Capitalists and Angel Investors for up to $2M in funding.
            </p>
          </section>

          {/* Question 6 */}
          <section id="data-security" className="bg-card p-6 rounded-xl border border-border/80 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1b4a3a] mb-2">Is my data secure?</h2>
            <p className="text-gray-700 leading-relaxed">
              Absolutely. Hati is fully compliant with Uganda's Data Protection and Privacy Act (DPPA). We use bank-grade encryption. Your mobile money statements and National ID are used solely for credit scoring, and we never sell your personal information.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}