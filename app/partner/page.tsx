"use client";

import Link from "next/link";
import { ArrowLeft, Check, Mail } from "lucide-react";

export default function PartnerPage() {
  const tiers = [
    {
      name: "HEADLINE PARTNER",
      limit: "1 only",
      description: "The ultimate alignment with Uganda's financial and agricultural future.",
      benefits: [
        "Naming rights on the Hati Campus Blitz",
        "Branded stage at the Hati Gala",
        "Opening ceremony speaking slot",
        "Anchor sponsor of the 3-month Campus Blitz",
        "Full-week broadcast integration with NBS",
        "10 masterclass sponsorships to distribute",
        "Co-branded pre and post-event content",
        "20 VIP delegate passes to the Hati Gala",
        "Brand in all Hati 2026 communications",
      ],
      featured: true,
    },
    {
      name: "PLATINUM PARTNER",
      limit: "2 only",
      description: "Deep integration into the Startup Show and GBE pipeline.",
      benefits: [
        "Named sponsor of the Hati Startup Show",
        "Panel speaking opportunity at the Gala",
        "Exhibition stand at the Campus Blitz finals",
        "4 sponsored masterclass seats",
        "Post-event content package (video highlights)",
        "12 delegate passes",
        "Brand in all digital and print materials",
      ],
      featured: false,
    },
    {
      name: "GOLD PARTNER",
      limit: "4 only",
      description: "Direct access to top university talent and enterprise data.",
      benefits: [
        "Named sponsor of a Hati Market activation",
        "Exhibition stand (4 sq m)",
        "2 sponsored masterclass seats",
        "Speaker slot in relevant session",
        "8 delegate passes",
        "Brand on event collateral",
      ],
      featured: false,
    },
    {
      name: "SILVER PARTNER",
      limit: "8 only",
      description: "Visibility among students, SMEs, and ecosystem builders.",
      benefits: [
        "Exhibition presence (2 sq m)",
        "1 speaking slot in breakout session",
        "4 delegate passes",
        "Brand on digital materials and programmes",
      ],
      featured: false,
    },
    {
      name: "COMMUNITY PARTNER",
      limit: "in-kind",
      description: "For ESOs, NGOs, academia, and ecosystem supporters.",
      benefits: [
        "Exhibition table",
        "2 delegate passes",
        "Brand in programme",
        "Suitable for ESOs, NGOs, academia, and ecosystem supporters",
      ],
      featured: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#fcfaf6] text-[#1b4a3a] pb-24 font-sans">
      {/* Top Navigation */}
      <div className="bg-white border-b border-[#e5e1d8]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-gray-500 hover:text-[#1b4a3a] transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#1b4a3a]/60">
          Partnership Hati 2026
        </h2>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Sponsorship & Partnership
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Partners at Hati do not buy space. They buy relevance. Each tier is designed to deliver a specific kind of value — reach, access, content, or influence — and packages are structured around what each partner type actually needs from the ecosystem.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <h3 className="text-2xl font-bold text-center mb-8">Sponsorship Packages</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-2xl p-8 border transition-all duration-200 ${
                tier.featured
                  ? "bg-[#1b4a3a] text-white border-transparent shadow-xl lg:-mt-4 lg:mb-4"
                  : "bg-white text-[#1b4a3a] border-[#e5e1d8] shadow-sm hover:shadow-md hover:border-[#1b4a3a]/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-lg font-bold tracking-wide ${tier.featured ? "text-[#c4f080]" : "text-[#1b4a3a]"}`}>
                  {tier.name}
                </h4>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    tier.featured ? "bg-white/10 text-white/80" : "bg-[#fcfaf6] text-gray-500"
                  }`}
                >
                  {tier.limit}
                </span>
              </div>
              <p className={`text-sm mb-6 h-12 ${tier.featured ? "text-white/80" : "text-gray-500"}`}>
                {tier.description}
              </p>
              
              <div className="flex-1 space-y-3 mb-8">
                {tier.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className={`size-5 shrink-0 ${tier.featured ? "text-[#c4f080]" : "text-[#1b4a3a]"}`} />
                    <span className={`text-sm ${tier.featured ? "text-white/90" : "text-gray-700"}`}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="mailto:partners@hati.africa"
                className={`w-full py-3 rounded-lg font-semibold text-center flex justify-center items-center gap-2 transition-colors ${
                  tier.featured
                    ? "bg-[#c4f080] text-[#0a1f17] hover:bg-white"
                    : "bg-[#1b4a3a] text-white hover:bg-[#153a2e]"
                }`}
              >
                Become a partner
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Contact CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-20 text-center space-y-6">
        <h3 className="text-2xl font-bold">Priority Sponsor Target Categories</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We are actively seeking partnerships with Telcos (MTN/Airtel), Financial Institutions (Banks, MFIs, SACCOs), FMCGs, and International Development Partners (FSDU, Mastercard Foundation, AVCA).
        </p>
        <div className="pt-4">
          <a
            href="mailto:partners@hati.africa"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-8 py-4 text-white font-semibold hover:bg-[#153a2e] transition-colors shadow-lg"
          >
            <Mail className="size-5" /> Contact Partnership Team
          </a>
        </div>
      </div>
    </main>
  );
}