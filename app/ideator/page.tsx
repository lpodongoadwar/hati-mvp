import Link from "next/link";
import { ArrowLeft, Trophy, Users, GraduationCap, PlayCircle, TrendingUp, Globe, ChevronRight } from "lucide-react";

export default function IdeatorLandingPage() {
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
        
        {/* Hero Section */}
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a] sm:text-5xl">
            Hati Startup Show: Pitch to Top Venture Capitalists and Angel Investors
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Top 20 Ideas Receive Funding on Fixed Terms. Next Top 30 Ideas Receive Funding on Dynamic Terms.
          </p>
          <div className="pt-4">
          </div>
        </div>

        {/* The Format (How to win) */}
        <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-foreground border-b pb-4">The Format: How to Get Funded</h2>
          <p className="text-gray-700 text-sm">
            You don't just submit a pitch; you compete for it. The Startup Show operates as a multi-track tournament to ensure the most disciplined and innovative founders get funded.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-xl space-y-2">
              <Trophy className="size-6 text-[#1b4a3a]" />
              <h3 className="font-semibold text-foreground">Club Champions</h3>
              <p className="text-xs text-gray-600">Top mobilizers from the Campus Blitz pitch internally to their club. The top 5 advance to the finals.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl space-y-2">
              <Users className="size-6 text-[#1b4a3a]" />
              <h3 className="font-semibold text-foreground">Top Public Vote</h3>
              <p className="text-xs text-gray-600">Individual founders pitch to the Hati Admin. The community votes on socials to advance the top 5 to the finals.</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-xl space-y-2">
              <GraduationCap className="size-6 text-[#1b4a3a]" />
              <h3 className="font-semibold text-foreground">University Nominees</h3>
              <p className="text-xs text-gray-600">The top-performing universities on the leaderboard get guaranteed slots to nominate their best student founders.</p>
            </div>
          </div>
        </section>

        {/* The Teaser Video */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Watch the Vision</h2>
          <div className="aspect-video bg-black rounded-2xl border border-border/80 overflow-hidden relative flex items-center justify-center group cursor-pointer">
            {/* Replace this div with your actual YouTube iframe embed later */}
            <div className="absolute inset-0 bg-[#0a1f17]/80 flex flex-col items-center justify-center text-white space-y-3 group-hover:bg-[#0a1f17]/70 transition-colors">
              <PlayCircle className="size-16 text-[#c4f080]" />
              <p className="font-medium text-sm tracking-wide">Play Hati Startup Show Teaser</p>
            </div>
          </div>
        </section>

        {/* The Macro Opportunity (Why Now) */}
        <section className="bg-[#fcfaf6] p-8 rounded-2xl border border-[#e5e1d8] shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-[#1b4a3a]">Why Africa? Why Now?</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-[#1b4a3a]/10 p-2 rounded-lg text-[#1b4a3a] h-fit">
                <Globe className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">The AfCFTA Effect</h3>
                <p className="text-sm text-gray-700 mt-1">
                  The African Continental Free Trade Area is creating the world's largest single market. Startups that build scalable infrastructure now will capture a continental audience of 1.3 billion people.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-[#1b4a3a]/10 p-2 rounded-lg text-[#1b4a3a] h-fit">
                <TrendingUp className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">The PAPSS Revolution</h3>
                <p className="text-sm text-gray-700 mt-1">
                  The Pan-African Payment and Settlement System (PAPSS) is eliminating cross-border payment friction. Founders building on digital rails today are perfectly positioned for instant, seamless pan-African expansion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="text-center pt-8 border-t border-border/80">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to build the future?</h2>
          <Link 
            href="/ideator/apply" 
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-8 py-4 text-lg font-semibold text-white hover:bg-[#153a2e] transition-colors shadow-md"
          >
            Apply to the Startup Show <ChevronRight className="size-5" />
          </Link>
        </div>

      </div>
    </main>
  );
}