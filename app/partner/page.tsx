import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PartnerPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a]">Become a Partner</h1>
        <p className="text-lg text-gray-600">
          Join us in building the financial infrastructure for the informal economy. 
          Partner with Hati to access verified deal flow, distribute financial products, or sponsor the Campus Blitz.
        </p>
        
        <div className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Get in Touch</h2>
          <p className="text-gray-700">
            For partnership inquiries, please reach out to us directly at:
          </p>
          <a href="mailto:partners@hati.africa" className="inline-block bg-[#1b4a3a] text-white px-6 py-3 rounded-md font-medium hover:bg-[#153a2e] transition-colors">
            partners@hati.africa
          </a>
        </div>
      </div>
    </main>
  );
}