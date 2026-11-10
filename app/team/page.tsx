import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      {/* Header */}
      <div className="bg-card border-b border-border/80">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a]">Our Team</h1>
          <p className="mt-2 text-lg text-gray-600">Meet the people building the financial infrastructure for the Global South.</p>
        </div>

        {/* Board Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Member 1 */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex items-start gap-4">
            <div className="bg-[#1b4a3a]/10 p-3 rounded-full text-[#1b4a3a] shrink-0">
              <User className="size-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Founder Name</h3>
              <p className="text-sm font-medium text-[#1b4a3a] mb-2">Founder & CEO</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Brief bio about the founder's background, their vision for Hati, and their experience in fintech or financial inclusion.
              </p>
            </div>
          </div>

          {/* Member 2 */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex items-start gap-4">
            <div className="bg-[#1b4a3a]/10 p-3 rounded-full text-[#1b4a3a] shrink-0">
              <User className="size-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Board Member Name</h3>
              <p className="text-sm font-medium text-[#1b4a3a] mb-2">Board Member</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Brief bio about their expertise, what they bring to the board, and why they believe in Hati's mission.
              </p>
            </div>
          </div>

          {/* Member 3 */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex items-start gap-4">
            <div className="bg-[#1b4a3a]/10 p-3 rounded-full text-[#1b4a3a] shrink-0">
              <User className="size-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Advisor Name</h3>
              <p className="text-sm font-medium text-[#1b4a3a] mb-2">Technical Advisor</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Brief bio about their technical background, previous startups, or role in the AI and credit scoring space.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}