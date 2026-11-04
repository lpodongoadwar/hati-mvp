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
      // 1. Get the user from the browser session
      const { data: { user } } = await supabase.auth.getUser();

      // 2. If no user, kick to login
      if (!user) {
        router.replace('/login');
        return;
      }

      // 3. Fetch their real score
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
    return <div className="min-h-screen flex items-center justify-center">Loading your profile...</div>;
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b border-border/80 py-4 sm:py-5">
          <Link href="/dashboard" className="inline-flex items-center gap-2.5">
            <Image alt="Hati" className="h-[50px] w-[124px] object-cover object-center mix-blend-darken" height={395} priority src={logoSource} unoptimized width={765} />
          </Link>

          <div className="flex items-center gap-4">
            <Badge className="hidden h-7 px-3 text-[10px] font-semibold tracking-[0.16em] border-[#1b4a3a] text-[#1b4a3a] sm:inline-flex" variant="outline">
              PREVIEW
            </Badge>
            <Link href="/profile" className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-[#1b4a3a]">
              <User className="size-5" />
              <span>Profile</span>
            </Link>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 pb-8 pt-7 sm:gap-10 sm:pb-10 sm:pt-10">
          <section aria-labelledby="score-title">
            <Card className="h-full rounded-[26px] border-border/80 bg-card shadow-[0_24px_70px_-44px_rgba(27,74,58,0.3)] flex flex-col">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold tracking-[-0.04em]" id="score-title">
                  Hati Trust Score
                </CardTitle>
                <Link href="/score-guide" className="text-muted-foreground hover:text-[#1b4a3a]">
                  <HelpCircle className="size-5" />
                </Link>
              </CardHeader>
              <CardContent className="pb-6 flex-1 flex flex-col justify-between">
                <HatiScoreGauge score={score} />
                <div className="mt-6">
                  <Link href="/participate" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b4a3a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#153a2e]">
                    Start Building Your Score <ArrowRight className="size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
          
          <DashboardRoadmap />
          <CampusBlitzBanner />
        </div>

        <footer className="mt-12 border-t border-border/80 py-10 text-sm text-muted-foreground">
          {/* ... (Keep your existing footer code here) ... */}
        </footer>
      </div>
    </main>
  )
}