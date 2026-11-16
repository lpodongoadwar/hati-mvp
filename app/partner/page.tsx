"use client";

import Link from "next/link";
import { ArrowLeft, Check, Mail, Building, Phone, Car, Plane, Hotel, Zap } from "lucide-react";

export default function PartnerPage() {
  const tiers = [
    {
      name: "HEADLINE TELCO PARTNER",
      limit: "2 Slots Only",
      price: "$50,000",
      description: "Exclusive category rights. Drive your lending products (MoMo Payback / Wewole) to 100K verified students.",
      benefits: [
        "Category Exclusivity (No competing telco on your users)",
        "USSD integration to push your lending products",
        "Exclusive 50% share of Telco-specific student data",
        "Naming rights on the Hati Campus Blitz",
        "Branded stage at the Hati Gala (with the President)",
        "Full-week broadcast integration with NBS",
      ],
      featured: true,
    },
    {
      name: "PLATINUM BANK PARTNER",
      limit: "4 Slots Only",
      price: "$25,000",
      description: "Guaranteed access to $500K in startup deposits and pre-vetted corporate clients.",
      benefits: [
        "Guaranteed allocation of 5 VC-funded startups ($500K deposit value)",
        "Right to pitch the 30 Angel-funded startups",
        "Exclusive 25% share of Banking-specific student data",
        "Panel speaking opportunity at the Gala",
        "Exhibition stand at the Campus Blitz finals",
        "12 VIP delegate passes",
      ],
      featured: false,
    },
    {
      name: "DFI / IMPACT PARTNER",
      limit: "1 Slot Only",
      price: "$15,000",
      description: "Align your brand with national financial inclusion and youth empowerment.",
      benefits: [
        "Naming rights to the 'Hati Gala' (e.g., 'The [Your Brand] Gala')",
        "Branding on all 100K Financial Literacy Modules",
        "Seat on the judging panel for the Startup Show",
        "Full social impact reporting on youth economic outcomes",
        "8 VIP delegate passes",
      ],
      featured: false,
    }
  ];

  const inKindPartners = [
    { name: "Official Hospitality Partner", target: "Luxury Hotels & Resorts", value: "3 months accommodation & bulk VC rates", icon: Hotel },
    { name: "Official Logistics Partner", target: "Automotive Dealers", value: "Branded vehicles for field teams & VCs", icon: Car },
    { name: "Official Energy Partner", target: "Oil & Gas Companies", value: "Fuel for NBS crew & field operations", icon: Zap },
    { name: "Official Airline Partner", target: "International & Regional Airlines", value: "Flight discounts for VCs + prize tickets", icon: Plane },
    { name: "Official Beverage Partner", target: "Beverage Manufacturers", value: "Drinks for all campus activations & Gala", icon: Building },
    { name: "Official Insurance Partner", target: "Insurance Providers", value: "Event insurance & micro-insure integration", icon: Phone },
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
          Campus Blitz Sponsorship
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Partners at Hati do not buy space. They buy access. We are mobilizing 100,000 students and deploying $2M in VC funding. We offer exclusive data, guaranteed deposits, and closed-loop customer acquisition.
        </p>
      </div>

      {/* Packages Grid */}
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <h3 className="text-2xl font-bold text-center mb-8">Cash Sponsorship Packages</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-2xl p-8 border transition-all duration-200 ${
                tier.featured
                  ? "bg-[#1b4a3a] text-white border-transparent shadow-xl md:-mt-4 md:mb-4"
                  : "bg-white text-[#1b4a3a] border-[#e5e1d8] shadow-sm hover:shadow-md hover:border-[#1b4a3a]/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`text-lg font-bold tracking-wide ${tier.featured ? "text-[#c4f080]" : "text-[#1b4a3a]"}`}>
                  {tier.name}
                </h4>
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tier.featured ? "bg-white/10 text-white/80" : "bg-[#fcfaf6] text-gray-500"}`}>
                  {tier.limit}
                </span>
              </div>

              <p className={`text-sm mb-6 h-16 ${tier.featured ? "text-white/80" : "text-gray-500"}`}>
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
                href={`mailto:partners@hati.africa?subject=Sponsorship Inquiry: ${tier.name}`}
                className={`w-full py-3 rounded-lg font-semibold text-center flex justify-center items-center gap-2 transition-colors ${
                  tier.featured
                    ? "bg-[#c4f080] text-[#0a1f17] hover:bg-white"
                    : "bg-[#1b4a3a] text-white hover:bg-[#153a2e]"
                }`}
              >
                Secure {tier.name}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* In-Kind Partners */}
      <div className="max-w-6xl mx-auto px-6 mt-20 space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold">Official In-Kind Partners</h3>
          <p className="text-gray-600 mt-2">We are seeking strategic in-kind partnerships to cover operational costs and provide VIP experiences.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inKindPartners.map((partner, index) => (
            <div key={index} className="bg-white border border-[#e5e1d8] rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
              <div className="bg-[#fcfaf6] p-3 rounded-full mb-4">
                <partner.icon className="size-6 text-[#1b4a3a]" />
              </div>
              <h4 className="font-bold text-[#1b4a3a]">{partner.name}</h4>
              <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">{partner.target}</p>
              <p className="text-sm text-gray-700 mt-3">{partner.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Contact CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-20 text-center space-y-6">
        <h3 className="text-2xl font-bold">Custom Packages Available</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          If your brand does not fit into a standard tier, we can build a bespoke partnership tailored to your specific market research or customer acquisition goals.
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