"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AcceptableUsePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <button onClick={() => router.back()} className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="size-8 text-[#1b4a3a]" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Acceptable Use Policy
            </h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: November 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">1. Purpose</h2>
            <p>This Acceptable Use Policy ("AUP") sets out the rules for using the Hati Platform. It is designed to protect the Platform, our users, and the integrity of the Hati Trust Score and Campus Blitz. This AUP is incorporated into and forms part of our Terms & Conditions.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">2. Prohibited Conduct</h2>
            <p>You agree not to engage in any of the following activities:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Fraudulent Data:</strong> Uploading fake Mini Statements, using someone else's NIN, or providing false information.</li>
              <li><strong>Automated Abuse:</strong> Using bots, scripts, macros, or any automated software to generate referrals, manipulate the leaderboard, or artificially inflate your score.</li>
              <li><strong>Multiple Accounts:</strong> Creating more than one account per individual or using multiple IP addresses to circumvent program limits.</li>
              <li><strong>Leaderboard Manipulation:</strong> Colluding with other users to unfairly exploit the Campus Blitz or create fake referrals.</li>
              <li><strong>System Abuse:</strong> Attempting to hack, reverse-engineer, or disrupt the Platform's servers or security measures.</li>
              <li><strong>Harassment:</strong> Harassing, threatening, or intimidating other users or Hati staff.</li>
              <li><strong>Illegal Activity:</strong> Using the Platform for any illegal purpose or in violation of any Ugandan law.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">3. Consequences of Violation</h2>
            <p>If we determine that you have violated this AUP, we may take any of the following actions, at our sole discretion:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Issue a warning.</li>
              <li>Suspend your account temporarily.</li>
              <li>Terminate your account permanently.</li>
              <li>Forfeit any accumulated points or pending rewards.</li>
              <li>Report you to law enforcement or regulatory authorities.</li>
            </ul>
            <p>We reserve the right to take any action we deem appropriate to protect the Platform and our users.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">4. Reporting Violations</h2>
            <p>If you become aware of any violation of this AUP, please report it to us at <a href="mailto:support@hatiinc.com" className="text-[#1b4a3a] underline">support@hatiinc.com</a>.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-border/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Hati, Inc. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/legal" className="hover:text-foreground transition-colors">Legal Hub</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </main>
  );
}