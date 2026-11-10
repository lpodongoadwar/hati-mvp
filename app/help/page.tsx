"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";

export default function HelpCenterPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How is my Hati Trust Score calculated?",
      a: "Your score is calculated using a proprietary algorithm that analyzes your mobile money statement, your repayment history, and your engagement with our financial literacy modules. We look at your transaction volume, average inflow, and income consistency."
    },
    {
      q: "Why do you need my National ID (NIN)?",
      a: "To prevent fraud and comply with financial regulations, we must verify that you are a real person. Your NIN ensures that your credit profile is unique to you and cannot be impersonated."
    },
    {
      q: "Is my financial data safe?",
      a: "Absolutely. We use bank-grade encryption. Your PDF statements are processed securely by our AI and are not shared with third parties without your explicit consent."
    },
    {
      q: "How do I unlock a higher credit tier?",
      a: "You move up tiers by consistently uploading fresh statements, completing financial literacy modules, and referring others. A higher score unlocks better loan terms and access to the Hati Startup Show."
    },
    {
      q: "What happens if I upload the same statement twice?",
      a: "Our system automatically detects duplicate PDFs and will block the upload to prevent artificial score inflation. You must upload a new, updated statement to recalculate your score."
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/profile" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Profile
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a]">Help Center</h1>
          <p className="mt-2 text-lg text-gray-600">Find answers to your questions about Hati.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card border border-border/80 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-muted/50 transition-colors"
              >
                {faq.q}
                {openFaq === index ? (
                  <ChevronUp className="size-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="size-5 text-muted-foreground shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-border/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-[#fcfaf6] p-8 rounded-2xl border border-[#e5e1d8] text-center space-y-4">
          <MessageCircle className="size-10 text-[#1b4a3a] mx-auto" />
          <h2 className="text-xl font-semibold text-[#1b4a3a]">Still need help?</h2>
          <p className="text-sm text-gray-600">Our support team is available on WhatsApp to assist you.</p>
          <a
            href="https://wa.me/256778490232?text=Hello%20Hati%20Support,%20I%20need%20help."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-6 py-3 text-sm font-medium text-white hover:bg-[#153a2e] transition-colors"
          >
            Chat with Support
          </a>
        </div>
      </div>
    </main>
  );
}