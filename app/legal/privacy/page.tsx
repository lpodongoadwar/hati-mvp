import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BackButton } from "@/components/back-button";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
     <div className="bg-card border-b border-border/80">
  <div className="max-w-3xl mx-auto px-6 py-4">
    <BackButton fallbackHref="/profile" label="Back" />
  </div>
</div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: November 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">1. Who We Are</h2>
            <p>Hati Innovations Uganda Limited ("Hati Innovations," "we," "us," or "our") is a technology company registered in the Republic of Uganda. We operate the Hati brand, including the Hati name, Hati, Inc. trade name, the Hati logo, and related intellectual property, under license from their respective owners. Hati Innovations Uganda Limited is the data controller and data collector responsible for the personal data you provide through the Hati Platform.</p>
            <p><strong>Important Regulatory Notice:</strong> Under the Uganda Data Protection and Privacy Act, Cap. 97 (DPPA) and the Data Protection and Privacy Regulations, 2021, we are required to register with the Personal Data Protection Office (PDPO) of Uganda [citation:1][citation:2]. Registration is mandatory for all entities that collect or process personal data of Ugandan citizens, regardless of where they are based [citation:3]. We maintain records of our legal basis for processing, including any cross-border data transfers, which are available for inspection by the PDPO upon request.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">2. Information We Collect</h2>
            <p>To generate your Hati Trust Score and operate the Platform, we collect the following categories of personal data:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Identity Data:</strong> Full Name, National Identification Number (NIN), Phone Number, Username, and Social Media Handle.</li>
              <li><strong>Financial Data:</strong> Mobile Money Mini-Statement PDFs, transaction history, savings behavior data, and any other financial information you voluntarily upload.</li>
              <li><strong>Platform Engagement Data:</strong> Module completion records, quiz scores, survey responses, referral counts, and leaderboard standings.</li>
              <li><strong>Technical Data:</strong> IP address, device type, browser information, and access times.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">3. Lawful Basis for Processing</h2>
            <p>We process your personal data on the following lawful bases:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Consent:</strong> You provide explicit consent when you register, upload your Mini-Statement, and agree to these terms. You may withdraw consent at any time, though this may affect your ability to use the Platform [citation:1].</li>
              <li><strong>Contractual Necessity:</strong> Processing is necessary to provide the services you have requested (e.g., calculating your Trust Score).</li>
              <li><strong>Legal Obligation:</strong> We may process data to comply with Ugandan laws, including anti-money laundering (AML) and Know Your Customer (KYC) requirements.</li>
              <li><strong>Legitimate Interest:</strong> We may process data to improve our services, prevent fraud, and ensure platform security.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">4. How We Use Your Data</h2>
            <p>We use your data to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Calculate and update your Hati Trust Score.</li>
              <li>Verify your identity and prevent fraud.</li>
              <li>Administer the Campus Blitz and Ambassador Program.</li>
              <li>Share anonymized, aggregated insights with third-party advertisers funding the program.</li>
              <li>Comply with legal and regulatory requirements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">5. Data Sharing and Disclosure</h2>
            <p>We do not sell your personally identifiable information. We may share your data with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Lenders:</strong> If you opt-in to access credit, we may share your Trust Score and verified data with partner banks, SACCOs, or microfinance institutions.</li>
              <li><strong>Service Providers:</strong> We use third-party processors (e.g., Supabase for hosting, Resend for email) who are contractually obligated to protect your data in accordance with the DPPA.</li>
              <li><strong>Advertisers:</strong> We share only aggregated, anonymized data (e.g., "70% of users prefer saving UGX 100/day").</li>
              <li><strong>Regulators:</strong> We may disclose data to the PDPO, Bank of Uganda, or law enforcement if required by law.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">6. Cross-Border Data Transfers</h2>
            <p>Your data may be stored or processed outside Uganda (e.g., on servers located in the European Union or the United States). In accordance with the DPPA, we only transfer data to jurisdictions that have adequate data protection safeguards, or where you have explicitly consented to the transfer [citation:3]. The PDPO has clarified that prior approval is not required for each transfer, but we must maintain proper records of the legal basis, safeguards, and justification for such transfers, which must be available for inspection during audits or investigations [citation:3].</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">7. Data Retention</h2>
            <p>We retain your personal data for as long as your account is active. Upon account closure, we may retain your data for up to ten (10) years to comply with the National Payment Systems Act and Bank of Uganda regulations. After this period, we will securely destroy or de-identify your data.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">8. Your Rights Under the DPPA</h2>
            <p>Under the Uganda Data Protection and Privacy Act, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your data (subject to our legal retention obligations).</li>
              <li>Object to processing for direct marketing purposes.</li>
              <li>Request restriction of processing in certain circumstances.</li>
              <li>Lodge a complaint with the Personal Data Protection Office (PDPO).</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:info@hatiinc.com" className="text-[#1b4a3a] underline">info@hatiinc.com</a>. We will respond within 30 days.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">9. Security</h2>
            <p>We implement appropriate technical and organisational measures to protect your data, including encryption, access controls, and regular security assessments. In the event of a data breach, we will notify the PDPO and affected users immediately, as required by the DPPA.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">10. Contact Us</h2>
            <p>For privacy-related inquiries, contact us at <a href="mailto:info@hatiinc.com" className="text-[#1b4a3a] underline">info@hatiinc.com</a>.</p>
            <p className="text-xs text-muted-foreground mt-4">Hati Innovations Uganda Limited is registered in the Republic of Uganda as a Private Company Limited by Shares Company Registration Number: 100000000 with registered offices at VentureLabs Africa, 11 Mpanga Close, Bugolobi, Kampala, Uganda.</p>
          </section>

        </div>

        <div className="pt-8 border-t border-border/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Hati, Inc. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </main>
  );
}