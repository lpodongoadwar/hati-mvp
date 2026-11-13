"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, ShieldCheck, TrendingUp, Building2, Lock } from "lucide-react";
import { createClient } from "@/lib/db";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ScoreGuidePage() {
  const supabase = createClient();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("score_history")
          .select("score, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });
        
        if (data) {
          // Format the date for the chart
          const formatted = data.map(item => ({
            score: item.score,
            date: new Date(item.created_at).toLocaleDateString("en-UG", { month: 'short', day: 'numeric' })
          }));
          setHistory(formatted);
        }
      }
      setLoading(false);
    }
    fetchHistory();
  }, [supabase]);

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

        {/* NEW: Score History Chart */}
        {!loading && history.length > 1 && (
          <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/80 pb-4">
              <TrendingUp className="size-8 text-[#1b4a3a]" />
              <h2 className="text-2xl font-semibold text-foreground">Your Score History</h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 850]} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#1b4a3a" strokeWidth={3} dot={{ r: 4, fill: "#1b4a3a" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

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
              <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><Lock className="size-6" /></div>
              <h3 className="text-xl font-bold text-foreground">Tier I: Foundation <span className="text-sm font-normal text-muted-foreground ml-2">(0 - 499)</span></h3>
            </div>
            <p className="text-sm text-gray-700"><strong>How to qualify:</strong> Sign up, verify your NIN, and complete your first financial literacy modules.</p>
            <p className="text-sm text-gray-700"><strong>Benefits:</strong> Access to the Hati Ambassadors Program to earn rewards, and a clear roadmap to build your financial identity.</p>
          </div>

          {/* Tier 2 */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-700"><TrendingUp className="size-6" /></div>
              <h3 className="text-xl font-bold text-foreground">Tier II: Growth <span className="text-sm font-normal text-muted-foreground ml-2">(500 - 649)</span></h3>
            </div>
            <p className="text-sm text-gray-700"><strong>How to qualify:</strong> Consistently save via the "Save With Every Transaction" model, complete all surveys, and maintain a high leaderboard ranking.</p>
            <p className="text-sm text-gray-700"><strong>Benefits:</strong> Unlock micro-loans from partner banks, qualify for Hati Travel rewards, and get access to financial coaching.</p>
          </div>

          {/* Tier 3 */}
          <div className="bg-card p-6 rounded-2xl border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg text-green-700"><Building2 className="size-6" /></div>
              <h3 className="text-xl font-bold text-foreground">Tier III: Enterprise <span className="text-sm font-normal text-muted-foreground ml-2">(650 - 850)</span></h3>
            </div>
            <p className="text-sm text-gray-700"><strong>How to qualify:</strong> Prove you have multiple income streams (e.g., a job + a side business), complete the full curriculum, and maintain high financial discipline.</p>
            <p className="text-sm text-gray-700"><strong>Benefits:</strong> Unlock the <strong>Ideator Status</strong>. You can pitch your business on the Hati Startup Show for up to $100K in VC funding, and access larger enterprise loans.</p>
          </div>
        </section>
      </div>
    </main>
  );
}