"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
          
          {/* Member 1: Founder */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex flex-col sm:flex-row items-start gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 bg-muted border-2 border-[#1b4a3a]/20">
              <img 
                src="/luzingu.jpg.png" 
                alt="Luzingu Philemon Odongo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a colored initial if image isn't found
                  e.currentTarget.src = "https://ui-avatars.com/api/?name=Luzingu+Odongo&background=1b4a3a&color=fff&size=256";
                }}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Luzingu Philemon Odongo</h3>
              <p className="text-sm font-medium text-[#1b4a3a] mb-2">Founder & CEO</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                The architect of the Hati ecosystem. With deep experience building financial literacy programs, Luzingu recognized that financial knowledge without capital is just an opinion. He is driving the vision to bridge the gap between informal savings and formal credit access in East Africa.
              </p>
            </div>
          </div>

          {/* Member 2: Teddy Ruge */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex flex-col sm:flex-row items-start gap-4">
            {/* Replace /teddy.jpg with his actual image */}
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 bg-muted border-2 border-[#1b4a3a]/20">
              <img 
                src="/teddy.jpg" 
                alt="Teddy Ruge" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://ui-avatars.com/api/?name=Teddy+Ruge&background=1b4a3a&color=fff&size=256";
                }}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Teddy Ruge</h3>
              <p className="text-sm font-medium text-[#1b4a3a] mb-2">Chief Angel & Executive Director</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                A serial entrepreneur and pioneer in the East African tech ecosystem (Hive Colab, Raintree Farms). Teddy brings a wealth of experience in building enterprises that solve real structural problems. He leads the AVCA/ABAN capital pipeline and the Hati Startup Show.
              </p>
            </div>
          </div>

          {/* Member 3: Joe Ajal */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm flex flex-col sm:flex-row items-start gap-4">
            {/* Replace /joe.jpg with his actual image */}
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 bg-muted border-2 border-[#1b4a3a]/20">
              <img 
                src="/joe.jpg" 
                alt="Joseph Ajal" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://ui-avatars.com/api/?name=Joseph+Ajal&background=1b4a3a&color=fff&size=256";
                }}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Joseph Ajal</h3>
              <p className="text-sm font-medium text-[#1b4a3a] mb-2">Executive Director & Board Secretary</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                An Executive Coach and HR expert with over 21 years of experience, including leadership roles with major corporates like Stanbic Bank and M-KOPA. Joe spearheads Hati's enterprise partnerships and ensures robust corporate governance.
              </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}