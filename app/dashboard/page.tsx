"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, ArrowRight, HelpCircle, AlertCircle } from 'lucide-react'
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
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      let { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const retry = await supabase.auth.getUser();
        user = retry.data.user;
      }

      if (!user) {
        router.replace('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*') // Fetch full profile
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      } else {
        // Create profile if it somehow doesn't exist
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0];
        const avatarUrl = user.user_metadata?.avatar_url || null;
        const safeUsername = user.email?.split('@')[0] + "_" + Math.floor(Math.random() * 10000);

        const { data: newProfile } = await supabase
          .from("profiles")
          .insert([{
            id: user.id,
            email: user.email,
            full_name: fullName,
            username: safeUsername,
            avatar_url: avatarUrl,
            score: 200,
            kyc_status: "Pending",
            completed_modules: [],
            referral_count: 0,
            phone_verified: false,
          }])
          .select()
          .single();
          
        if (newProfile) setProfile(newProfile);
      }

      setLoading(false);
    }
    loadUser();
  }, [router, supabase]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading your profile...</div>;
  }

  // Check if they need to complete their profile
  const needsProfileCompletion = !profile?.phone || !profile?.nin;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b border-border/80 py-4 sm:py-5">
          <Link href="/dashboard" className="inline-flex items-center gap-2.5">
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
            <Card className="h-full rounded-[26px] border-border/80 bg-card shadow-[0_24px_70px_-44px_rgba(27,74,58,0.3)] sm:[--card-spacing:--spacing(6)] flex flex-col">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold tracking-[-0.04em]">
                  {needsProfileCompletion ? "Complete Your Profile" : "Hati Trust Score"}
                </CardTitle>
                <Link href="/score-guide" className="text-muted-foreground hover:text-[#1b4a3a] transition-colors">
                  <HelpCircle className="size-5" />
                </Link>
              </CardHeader>
              <CardContent className="pb-6 flex-1 flex flex-col justify-between">
                
                {/* CONDITIONAL RENDERING BASED ON PROFILE STATUS */}
                {needsProfileCompletion ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                    <div className="bg-yellow-100 p-4 rounded-full text-yellow-600">
                      <AlertCircle className="size-10" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Action Required</h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                        Since you signed up with Google, we need a few more details to build your Hati Score.
                      </p>
                    </div>
                    <Link 
                      href="/dashboard/complete-profile" 
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1b4a3a] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#153a2e] mt-4"
                    >
                      Complete Profile <ArrowRight className="size-4" />
                    </Link>
                  </div>
                ) : (
                  <>
                    <HatiScoreGauge score={profile?.score || 200} />
                    <div className="mt-6">
                      <Link href="/participate" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b4a3a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#153a2e]">
                        Start Building Your Score <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </section>
          
          <DashboardRoadmap score={profile?.score || 200} />
          <CampusBlitzBanner />
        </div>

        <footer className="mt-12 border-t border-border/80 py-10 text-sm text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#1b4a3a]">Hati, Inc.</h3>
             <ul className="space-y-2 text-xs">
                <li><Link href="/about" className="transition-colors hover:text-[#1b4a3a]">About Hati</Link></li>
                <li><Link href="/team" className="transition-colors hover:text-[#1b4a3a]">Our Team</Link></li>
                <li><Link href="/help" className="transition-colors hover:text-[#1b4a3a]">FAQs</Link></li>
                <li><Link href="/partner" className="transition-colors hover:text-[#1b4a3a]">Become A Partner</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#1b4a3a]">Resources</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="https://nilepost.co.ug/opinions/367159/credit-is-not-the-enemy-borrow-to-build-wealth" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#1b4a3a]">Why Credit is Not the Enemy</a></li>
                <li><a href="https://www.monitor.co.ug/uganda/business/markets/-the-double-squeeze-rising-prices-costly-loans-and-pressure-on-growth-5660888#story" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#1b4a3a]">The Macroeconomic Squeeze in Uganda</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-[#1b4a3a]">Contact Us</h3>
              <div className="space-y-2 text-xs">
                <a href="mailto:info@hatiinc.com" className="flex items-center gap-2 transition-colors hover:text-[#1b4a3a]"><Mail className="size-4" /> info@hatiinc.com</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-xs md:flex-row">
            <p>© 2026 Hati, Inc. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  )
}