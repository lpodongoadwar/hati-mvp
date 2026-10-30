import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: October 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">1. Introduction</h2>
            <p>Hati, Inc. ("Hati," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. This policy is compliant with the Uganda Data Protection and Privacy Act (DPPA).</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">2. Information We Collect</h2>
            <p>To generate your Hati Trust Score and operate the Platform, we collect the following personal data:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity Data:</strong> Your National Identification Number (NIN), Full Name, and Phone Number.</li>
              <li><strong>Financial Data:</strong> The Mobile Money Mini-Statement PDFs you upload to the Platform.</li>
              <li><strong>Usage Data:</strong> Information about your interactions with the Platform, including referrals, quiz results, and leaderboard standings.</li>
              <li><strong>Technical Data:</strong> IP address, device type, and access times.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">3. How We Use Your Information</h2>
            <p>We use the data we collect for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To calculate and update your Hati Trust Score.</li>
              <li>To verify your identity and prevent fraud (including the SIM Declaration process).</li>
              <li>To administer the Ambassador Program and Startup Pipeline.</li>
              <li>To share anonymized data with third-party advertisers funding the program.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">4. Data Sharing and Disclosure</h2>
            <p>We do not sell your personally identifiable information. We may share your data in the following circumstances:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>With Lenders:</strong> If you opt-in to access credit, we may share your Hati Trust Score and verified data with partner banks or microfinance institutions.</li>
              <li><strong>With Advertisers:</strong> We share aggregated, anonymized insights (e.g., "70% of students prefer saving UGX 500/day").</li>
              <li><strong>Legal Requirements:</strong> We may disclose data to law enforcement or regulatory bodies if required by Ugandan law.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">5. Data Retention</h2>
            <p>In compliance with the National Payment Systems Act and Bank of Uganda regulations, we are required to retain your financial data and identity records for a period of up to <strong>ten (10) years</strong> after your account is closed or becomes inactive.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">6. Your Rights Under the DPPA</h2>
            <p>Under the Uganda Data Protection and Privacy Act, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data (subject to our legal retention obligations).</li>
              <li>Object to the processing of your data for marketing purposes.</li>
            </ul>
            <p>To exercise these rights, please contact us at <a href="mailto:support@hati.africa" className="text-[#1b4a3a] underline">support@hati.africa</a>.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">7. Security</h2>
            <p>We implement administrative, technical, and physical security measures to protect your personal information. However, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
          </section>

        </div>

        <div className="pt-8 border-t border-border/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Hati, Inc. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>

      </div>
    </main>
  );
}