"use client";

import Link from "next/link";
import { ArrowLeft, Shield, FileText, Scale, AlertTriangle, Database } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LegalHubPage() {
  const router = useRouter();

  const documents = [
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal data in accordance with the Uganda DPPA.",
      href: "/legal/privacy",
      icon: Shield,
    },
    {
      title: "Terms & Conditions",
      description: "The rules governing your use of the Hati Platform.",
      href: "/legal/terms",
      icon: FileText,
    },
    {
      title: "Ambassadors Program Rules",
      description: "Official promotional competition rules under the National Lotteries and Gaming Regulatory Board.",
      href: "/legal/competition-agreement",
      icon: Scale,
    },
    {
      title: "Acceptable Use Policy",
      description: "Rules for user conduct and the consequences of prohibited actions.",
      href: "/legal/aup",
      icon: AlertTriangle,
    },
    {
      title: "Data Processing Agreement",
      description: "How Hati Innovations Uganda Limited engages third-party processors under the DPPA.",
      href: "/legal/dpa",
      icon: Database,
    },
  ];

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
            <Scale className="size-8 text-[#1b4a3a]" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Legal & Compliance
            </h1>
          </div>
          <p className="mt-2 text-muted-foreground">Transparency is core to our mission. Review our policies below.</p>
        </div>

        <div className="grid gap-4">
          {documents.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <Link 
                key={index} 
                href={doc.href}
                className="flex items-start gap-4 p-6 bg-card border border-border/80 rounded-2xl shadow-sm hover:border-[#1b4a3a]/40 hover:shadow-md transition-all group"
              >
                <div className="bg-[#1b4a3a]/10 p-3 rounded-xl text-[#1b4a3a] group-hover:bg-[#1b4a3a] group-hover:text-white transition-colors">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#1b4a3a]">{doc.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-border/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Hati, Inc. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </div>
        </div>
      </div>
    </main>
  );
}