import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/profile" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Profile
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a] flex items-center gap-3">
            <Scale className="size-10" /> Legal & Compliance
          </h1>
          <p className="mt-2 text-lg text-gray-600">Transparency is core to our mission.</p>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm prose prose-sm max-w-none text-gray-700 space-y-6">

          <section>
            <h2 className="text-2xl font-semibold text-[#1b4a3a] mb-3">1. Data Protection & Privacy</h2>
            <p>
              Hati is committed to protecting your personal and financial data in accordance with the <strong>Uganda Data Protection and Privacy Act (DPPA)</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>We only collect data necessary to calculate your credit score (Mobile Money statements, NIN, and contact info).</li>
              <li>Your data is stored securely on encrypted servers.</li>
              <li>We do not sell your data to third-party advertisers.</li>
              <li>You have the right to request the deletion of your data at any time by contacting support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1b4a3a] mb-3">2. Terms of Service</h2>
            <p>
              By using Hati, you agree to provide accurate information. Uploading forged documents, attempting to manipulate the scoring algorithm (e.g., uploading duplicate PDFs), or creating fake accounts will result in immediate account suspension.
            </p>
            <p className="mt-2">
              Hati provides a <strong>credit score and financial assessment</strong>, not direct loans. Loan approvals are subject to our partner financial institutions' underwriting criteria.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#1b4a3a] mb-3">3. Corporate Information</h2>
            <p>
              Hati, Inc., the Hati Logo and associated marks are trademarks owned by <strong>Hati Solutions Uganda Limited</strong>. The platform and technology are operated by <strong>Hati Solutions Limited</strong>, a wholly-owned subsidiary of Hati Holdings.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              *Legal documents are currently being finalized with our corporate counsel. For specific legal inquiries, please email legal@hati.africa.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}