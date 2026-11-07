"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, ArrowRight, HelpCircle } from 'lucide-react'
import { siInstagram, siX, siTiktok } from 'simple-icons'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from "@/lib/db";

import { CampusBlitzBanner } from '@/components/campus-blitz-banner'
import { DashboardRoadmap } from '@/components/dashboard-roadmap'
import { HatiScoreGauge } from '@/components/hati-score-gauge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const logoSource = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_0000000026b481f4ac4092f29fa586e7%20%281%29.png-aEG4UagFYjCgRKM7hpezKdtI5qDLCJ.jpeg'

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('score')
        .eq('id', user.id)
        .single();

      setScore(profile?.score || 200);
      setLoading(false);
    }
    loadUser();
  }, [router, supabase]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading your profile...</div>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b border-border/80 py-4 sm:py-5">
          <Link
            aria-label="Hati home"
            className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1b4a3a]/25"
            href="/dashboard"
          >
            <Image
              alt="Hati"
              className="h-[50px] w-[124px] object-cover object-center mix-blend-darken"
              height={395}
              priority
              src={logoSource}
              unoptimized
              width={765}
            />
          </Link>

          <div className="flex items-center gap-4">
            <Badge
              className="hidden h-7 px-3 text-[10px] font-semibold tracking-[0.16em] border-[#1b4a3a] text-[#1b4a3a] sm:inline-flex"
              variant="outline"
            >
              PREVIEW
            </Badge>
            <Link
              href="/profile"
              className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-[#1b4a3a]"
            >
              <User className="size-5" />
              <span>Profile</span>
            </Link>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 pb-8 pt-7 sm:gap-10 sm:pb-10 sm:pt-10">
          
          <section aria-labelledby="score-title">
            <Card className="h-full rounded-[26px] border-border/80 bg-card shadow-[0_24px_70px_-44px_rgba(27,74,58,0.3)] sm:[--card-spacing:--spacing(6)] flex flex-col">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  aria-level={2}
                  className="text-xl font-semibold tracking-[-0.04em]"
                  id="score-title"
                  role="heading"
                >
                  Hati Trust Score
                </CardTitle>
                <Link 
                  href="/score-guide" 
                  className="text-muted-foreground hover:text-[#1b4a3a] transition-colors"
                  aria-label="Learn more about your Hati Score"
                >
                  <HelpCircle className="size-5" />
                </Link>
              </CardHeader>
              <CardContent className="pb-6 flex-1 flex flex-col justify-between">
                <HatiScoreGauge score={score} />
                
                <div className="mt-6">
                  <Link 
                    href="/participate" 
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b4a3a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#153a2e]"
                  >
                    Start Building Your Score <ArrowRight className="size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
          
          <DashboardRoadmap score={score} />
          
          <CampusBlitzBanner />
        </div>

        <footer className="mt-12 border-t border-border/80 py-10 text-sm text-muted-foreground">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#1b4a3a]">Hati, Inc.</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/about" className="transition-colors hover:text-[#1b4a3a]">
                    About Hati
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="transition-colors hover:text-[#1b4a3a]">
                    Hati Ambassadors Program
                  </Link>
                </li>
                <li>
                  <Link href="/ideator" className="transition-colors hover:text-[#1b4a3a]">
                    Hati Startup Show
                  </Link>
                </li>
              </ul>
            </div>

 {/* NEW Column 2: Resources (Articles & Research) */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#1b4a3a]">Resources</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a 
                    href="https://nilepost.co.ug/opinions/367159/credit-is-not-the-enemy-borrow-to-build-wealth" 
                    target="_blank" 
                    rel="noreferrer"
                    className="transition-colors hover:text-[#1b4a3a]"
                  >
                    Why Credit is Not the Enemy
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.monitor.co.ug/uganda/business/markets/-the-double-squeeze-rising-prices-costly-loans-and-pressure-on-growth-5660888#story" 
                    target="_blank" 
                    rel="noreferrer"
                    className="transition-colors hover:text-[#1b4a3a]"
                  >
                    The Macroeconomic Squeeze in Uganda
                  </a>
                </li>
                <li>
                  <a 
                    href="https://nilepost.co.ug/businesses/382203/centenary-airtel-money-launch-kwaata-sente-digital-loan-product" 
                    target="_blank" 
                    rel="noreferrer"
                    className="transition-colors hover:text-[#1b4a3a]"
                  >
                    The Digital Lending Landscape in Uganda
                  </a>
                </li>
                <li>
                  <a 
                    href="https://observer.ug/education/broken-dreams-and-budget-limits-inside-ugandas-48-9-higher-education-loan-surge/#google_vignette" 
                    target="_blank" 
                    rel="noreferrer"
                    className="transition-colors hover:text-[#1b4a3a]"
                  >
                    The Education Financing Crisis in Uganda
                  </a>
                </li>
                <li>
                  <a 
                    href="https://nilepost.co.ug/business/371825/minister-musasizi-urges-banks-to-cut-lending-rates-to-support-economic-growth" 
                    target="_blank" 
                    rel="noreferrer"
                    className="transition-colors hover:text-[#1b4a3a]"
                  >
                    Minister Musasizi on Credit Data
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#1b4a3a]">Contact Us</h3>
              <div className="space-y-2 text-xs">
                <a
                  href="mailto:support@hati.africa"
                  className="flex items-center gap-2 transition-colors hover:text-[#1b4a3a]"
                >
                  <Mail className="size-4" /> support@hati.africa
                </a>
                <a
                  href="tel:+256700000000"
                  className="flex items-center gap-2 transition-colors hover:text-[#1b4a3a]"
                >
                  <Phone className="size-4" /> +256 700 000 000
                </a>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://x.com/hatiincnet"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Hati on X"
                  className="transition-opacity hover:opacity-80"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="size-5 fill-current text-muted-foreground hover:fill-[#1b4a3a]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={siX.path} />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/hati.inc?rpxt=b2U2Zmd3N2lvbDlh"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Hati on Instagram"
                  className="transition-opacity hover:opacity-80"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="size-5 fill-current text-muted-foreground hover:fill-[#1b4a3a]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={siInstagram.path} />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@hati.inc"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Hati on TikTok"
                  className="transition-opacity hover:opacity-80"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="size-5 fill-current text-muted-foreground hover:fill-[#1b4a3a]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={siTiktok.path} />
                  </svg>
                </a>
              </div>
            </div>

            <div className="hidden md:block"></div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-xs md:flex-row">
            <p>© 2026 Hati, Inc. All Rights Reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="transition-colors hover:text-[#1b4a3a]">Privacy Policy</Link>
              <Link href="/terms" className="transition-colors hover:text-[#1b4a3a]">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}