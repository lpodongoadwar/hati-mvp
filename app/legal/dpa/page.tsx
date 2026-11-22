"use client";

import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DPAPage() {
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
            <Database className="size-8 text-[#1b4a3a]" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Data Processing Agreement
            </h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: November 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-gray-700">
          
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">1. Introduction</h2>
            <p>This Data Processing Agreement ("DPA") forms part of the agreement between <strong>Hati Innovations Uganda Limited</strong> ("Hati," "we," "us") and any third-party service provider ("Processor") that processes personal data on our behalf. This DPA is designed to ensure compliance with the Uganda Data Protection and Privacy Act, Cap. 97 (DPPA) and the Data Protection and Privacy Regulations, 2021.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">2. Definitions</h2>
            <p><strong>2.1 "Controller":</strong> Hati Innovations Uganda Limited, which determines the purposes and means of processing personal data.</p>
            <p><strong>2.2 "Processor":</strong> Any third-party service provider that processes personal data on behalf of the Controller.</p>
            <p><strong>2.3 "Personal Data":</strong> Any information relating to an identified or identifiable natural person, as defined in the DPPA.</p>
            <p><strong>2.4 "Processing":</strong> Any operation performed on personal data, including collection, storage, use, disclosure, and deletion.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">3. Obligations of the Processor</h2>
            <p>The Processor agrees to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process personal data only on documented instructions from Hati.</li>
              <li>Ensure that persons authorized to process the personal data have committed themselves to confidentiality.</li>
              <li>Implement appropriate technical and organisational measures to protect personal data against unauthorized or unlawful processing and against accidental loss, destruction, or damage.</li>
              <li>Assist Hati in ensuring compliance with the DPPA, including responding to data subject requests.</li>
              <li>Notify Hati immediately if it becomes aware of any data breach.</li>
              <li>Delete or return all personal data to Hati at the end of the provision of services, unless required by law to store it.</li>
              <li>Allow for and contribute to audits, including inspections, conducted by Hati or another auditor mandated by Hati.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">4. Sub-Processors</h2>
            <p>The Processor shall not engage another processor ("Sub-Processor") without prior specific or general written authorization from Hati. If Hati provides general written authorization, the Processor shall inform Hati of any intended changes concerning the addition or replacement of other processors, thereby giving Hati the opportunity to object to such changes.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">5. Cross-Border Transfers</h2>
            <p>If the Processor transfers personal data outside Uganda, it must ensure that the transfer is compliant with the DPPA. This includes ensuring that the transfer is to a jurisdiction with adequate data protection safeguards, or that appropriate safeguards are in place, and maintaining records of the legal basis for the transfer as required by the PDPO.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">6. Liability and Indemnity</h2>
            <p>The Processor shall be liable for any damages caused by its processing activities that are in breach of this DPA or the DPPA. The Processor shall indemnify Hati against any claims, fines, or penalties arising from such breaches.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-[#1b4a3a]">7. Governing Law</h2>
            <p>This DPA shall be governed by and construed in accordance with the laws of the Republic of Uganda.</p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-border/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Hati, Inc. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/legal" className="hover:text-foreground transition-colors">Legal Hub</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </main>
  );
}