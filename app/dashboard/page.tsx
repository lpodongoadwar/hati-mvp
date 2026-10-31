import { User, Mail, Phone } from 'lucide-react'
import { siInstagram, siX, siTiktok } from 'simple-icons'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { CampusBlitzBanner } from '@/components/campus-blitz-banner'
import { DashboardRoadmap } from '@/components/dashboard-roadmap'
import { HatiScoreGauge } from '@/components/hati-score-gauge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const logoSource =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_0000000026b481f4ac4092f29fa586e7%20%281%29.png-aEG4UagFYjCgRKM7hpezKdtI5qDLCJ.jpeg'

export const metadata: Metadata = {
  title: 'Score & Roadmap',
  description:
    'View an illustrative Hati Score and the tiered steps that follow.',
}

export default function DashboardPage() {
  const score = 450

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-8 lg:px-12">
                <header className="flex items-center justify-between gap-4 border-b border-border/80 py-4 sm:py-5">
          <Link
            aria-label="Hati home"
            className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25"
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
              className="hidden h-7 px-3 text-[10px] font-semibold tracking-[0.16em] sm:inline-flex"
              variant="outline"
            >
              PREVIEW
            </Badge>
            <Link
              href="/profile"
              className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <User className="size-5" />
              <span>Profile</span>
            </Link>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 pb-8 pt-7 sm:gap-10 sm:pb-10 sm:pt-10">
                      <section aria-labelledby="score-title">
              <Card className="h-full rounded-[26px] border-border/80 bg-card shadow-[0_24px_70px_-44px_rgba(31,70,48,0.3)] sm:[--card-spacing:--spacing(6)] flex flex-col">
                <CardHeader>
                  <CardTitle
                    aria-level={2}
                    className="text-xl font-semibold tracking-[-0.04em]"
                    id="score-title"
                    role="heading"
                  >
                    Hati Trust Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6 flex-1 flex flex-col justify-between">
                  <HatiScoreGauge score={score} />
                  
                  {/* The Button Inside the Bubble */}
                  <div className="mt-6">
                    <Link 
                      href="/participate" 
                      className="inline-flex w-full items-center justify-center rounded-xl bg-[#1b4a3a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#153a2e]"
                    >
                      Start Building Your Score
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>
            
          <CampusBlitzBanner />
        </div>

        <footer className="mt-12 border-t border-border/80 py-10 text-sm text-muted-foreground">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Column 1: Hati, Inc. (Navigation) */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">Hati, Inc.</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/about" className="transition-colors hover:text-foreground">
                    About Hati
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="transition-colors hover:text-foreground">
                    Hati Ambassadors Program
                  </Link>
                </li>
                <li>
                  <Link href="/ideator" className="transition-colors hover:text-foreground">
                    Hati Startup Show
                  </Link>
                </li>
                <li>
                </li>
              </ul>
            </div>

            {/* Column 2: Contact & Socials */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Contact Us</h3>
              <div className="space-y-2 text-xs">
                <a
                  href="mailto:support@hati.africa"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="size-4" /> support@hati.africa
                </a>
                <a
                  href="tel:+256700000000"
                  className="flex items-center gap-2 transition-colors hover:text-foreground"
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
                    className="size-5 fill-current text-muted-foreground hover:text-[#1b4a3a]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={siX.path} />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/hati.net"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Hati on Instagram"
                  className="transition-opacity hover:opacity-80"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="size-5 fill-current text-muted-foreground hover:text-[#1b4a3a]"
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
                    className="size-5 fill-current text-muted-foreground hover:text-[#1b4a3a]"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={siTiktok.path} />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 3: Call to Action Button */}
            <div className="flex justify-center md:items-start">
          
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-xs md:flex-row">
            <p>© 2026 Hati, Inc. All Rights Reserved.</p>
            <div className="flex gap-4">
             <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="transition-colors hover:text-foreground">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
