"use client";

import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CampusBlitzRulesPage() {
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
            <Trophy className="size-8 text-[#1b4a3a]" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ambassadors Program Rules
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Official Promotional Competition Rules & Terms
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: November 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">1. Promoter & Regulatory Compliance</h2>
            <p>This promotional competition ("Campus Blitz") is organized by <strong>Hati Innovations Uganda Limited</strong> ("Hati," "we," "us"), a technology company registered in the Republic of Uganda.</p>
            <p><strong>Regulatory Notice:</strong> This competition is a "promotional competition" as defined under the Lotteries and Gaming Act, 2016, and is regulated by the National Lotteries and Gaming Regulatory Board (LGRB) of Uganda. In compliance with LGRB requirements, these rules set out the official name, eligibility criteria, competition period, prize details, and winner selection process. A copy of these rules is available to all participants on the Hati Platform.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">2. Official Competition Details</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Official Name:</strong> Hati Campus Blitz 2026</li>
              <li><strong>Competition Period:</strong> [Insert Start Date] to [Insert End Date] (the "Competition Period").</li>
              <li><strong>Geographic Scope:</strong> Republic of Uganda.</li>
              <li><strong>Eligibility:</strong> Open to registered university students in Uganda who are 18 years of age or older. Employees of Hati, their immediate family members, and agents are not eligible to participate.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">3. How to Enter</h2>
            <p>To participate in the Campus Blitz, you must:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Register on the Hati Platform with a valid university email address and accurate personal details.</li>
              <li>Complete the mandatory financial literacy modules.</li>
              <li>Refer other eligible students using your unique referral link.</li>
              <li>Engage with the Platform as specified in the competition guidelines.</li>
            </ul>
            <p>No purchase is necessary to enter or win. A purchase will not increase your chances of winning.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">4. Winner Selection & Prize Details</h2>
            <p><strong>4.1 Selection Method:</strong> Winners will be selected based on their final leaderboard standings at the end of the Competition Period. The leaderboard is calculated based on a combination of referral count and module completion, as detailed on the Platform.</p>
            <p><strong>4.2 Prizes:</strong> The prize pool is dynamic and funded by third-party advertisers. The total prize value and the number of prizes will be published on the Platform and updated periodically. Prizes are non-transferable and no cash alternative is available.</p>
            <p><strong>4.3 Prize Claiming:</strong> Winners will be notified via the email or phone number registered on their account within seven (7) days of the end of the Competition Period. Winners must claim their prizes within 30 days of notification. Unclaimed prizes will be forfeited.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">5. Disqualification & Prohibited Conduct</h2>
            <p>Hati reserves the right, in its sole discretion, to disqualify any participant and forfeit their prizes if they:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Submit fraudulent data or use fake referral accounts.</li>
              <li>Use bots, scripts, or automated software to manipulate the leaderboard.</li>
              <li>Create multiple accounts.</li>
              <li>Collude with other users to exploit the competition.</li>
              <li>Violate the Hati Terms & Conditions or Acceptable Use Policy.</li>
            </ul>
            <p>All decisions made by Hati regarding disqualification and winner selection are final and binding.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">6. General Terms</h2>
            <p><strong>6.1 Modification:</strong> Hati reserves the right to modify, suspend, or terminate the Campus Blitz at any time, with or without notice, if advertiser funding targets are not met or for any other operational reason.</p>
            <p><strong>6.2 Governing Law:</strong> These rules are governed by the laws of the Republic of Uganda.</p>
            <p><strong>6.3 Contact:</strong> For questions about the Campus Blitz, contact <a href="mailto:support@hatiinc.com" className="text-[#1b4a3a] underline">support@hatiinc.com</a>.</p>
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