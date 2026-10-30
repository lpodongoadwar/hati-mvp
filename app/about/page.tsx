import Link from "next/link";
import { ArrowLeft, Target, Eye, Map } from "lucide-react";

export default function AboutPage() {
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

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a]">
            About Hati
          </h1>
          <p className="text-xl font-medium text-foreground/80">
            The Credit & Payments Infrastructure for the Global South.
          </p>
        </div>

        <div className="space-y-10">
          
          {/* Mission */}
          <section className="space-y-4 bg-card p-8 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-[#1b4a3a]/10 p-2 rounded-lg text-[#1b4a3a]">
                <Target className="size-6" />
              </div>
              <h2 className="text-2xl font-semibold text-[#1b4a3a]">The Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Financial literacy without money is just an opinion—and a stale one at that. We believe that teaching people how to manage money is useless if they cannot access formal credit. Hati exists to build the missing infrastructure that turns everyday survival into generational wealth.
            </p>
          </section>

          {/* Vision */}
          <section className="space-y-4 bg-card p-8 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-[#1b4a3a]/10 p-2 rounded-lg text-[#1b4a3a]">
                <Eye className="size-6" />
              </div>
              <h2 className="text-2xl font-semibold text-[#1b4a3a]">The Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We are building the financial operating system for the 1 billion mobile money users across the Global South. We build financial literacy, turn everyday purchases into locked savings, and locked savings into verified credit scores. We don't just score the unbanked; we manage the institutional capital that makes them bankable.
            </p>
          </section>

          {/* Roadmap */}
          <section className="space-y-4 bg-card p-8 rounded-2xl border border-border/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-[#1b4a3a]/10 p-2 rounded-lg text-[#1b4a3a]">
                <Map className="size-6" />
              </div>
              <h2 className="text-2xl font-semibold text-[#1b4a3a]">The Roadmap</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We start with the Campus Blitz in Uganda, helping students develop financial literacy and understanding on how to procure funding. From there, we launch the 'Save With Every Purchase' model and scale across East Africa, develop the infrastructure to run national credit systems, and eventually expand to emerging markets globally.
            </p>
          </section>

        </div>

        <div className="pt-8 border-t border-border/80 flex justify-center">
          <Link href="/participate" className="inline-flex items-center justify-center rounded-md bg-[#1b4a3a] px-8 py-4 text-lg font-semibold text-white hover:bg-[#153a2e] transition-colors">
            Join Us
          </Link>
        </div>
      </div>
    </main>
  );
}