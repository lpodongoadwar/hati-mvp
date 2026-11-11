import Link from "next/link";
import { ArrowUpRight, Lightbulb, UsersRound, ShoppingBag, ShieldCheck, Plane, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CampusBlitzBanner() {
  return (
    <section aria-labelledby="campus-blitz-title" className="space-y-4">
      <Card className="overflow-hidden rounded-[26px] border-transparent bg-[#1b4a3a] text-white shadow-[0_24px_70px_-44px_rgba(31,70,48,0.5)] sm:[--card-spacing:--spacing(8)]">
        <CardHeader className="gap-3 px-6 sm:px-8">
          <Badge
            className="h-6 w-fit border-white/20 text-[10px] tracking-[0.16em] text-white"
            variant="outline"
          >
            HATI AMBASSADORS PROGRAM
          </Badge>
          <CardTitle
            aria-level={2}
            className="text-2xl font-semibold tracking-[-0.04em] text-white"
            id="campus-blitz-title"
            role="heading"
          >
            Compete in the Ambassadors Program
          </CardTitle>
          <CardDescription className="max-w-xl text-sm text-white/80">
            Bring your skills together and turn bold ideas into momentum for financial literacy and inclusion.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-6 pb-8 sm:px-8">
          
          {/* Roles */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Choose your role
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link 
                href="/leaderboard" 
                className="group flex h-12 flex-1 items-center justify-between rounded-md border border-white/20 px-4 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <UsersRound aria-hidden="true" className="size-4" />
                  Mobilizer
                </span>
                <ArrowUpRight aria-hidden="true" className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>

              <Link 
                href="/ideator" 
                className="group flex h-12 flex-1 items-center justify-between rounded-md border border-white/20 px-4 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb aria-hidden="true" className="size-4" />
                  Ideator
                </span>
                <ArrowUpRight aria-hidden="true" className="size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

                 {/* COMING SOON TO HATI */}
        <div className="space-y-4 mt-12">
          <h2 className="text-sm font-semibold tracking-widest text-[#c4f080] uppercase">
            Coming Soon to Hati
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Hati Market */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="text-[#c4f080]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Hati Market</h3>
              <p className="text-sm text-white/70">Save with every purchase at campus vendors and partner stores.</p>
            </div>

            {/* 2.  Hati Score API */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="text-[#c4f080]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Hati Score API</h3>
              <p className="text-sm text-white/70">A unified database allowing banks and syndicated lenders to underwrite thin-file users.</p>
            </div>

            {/* 3. Hati Insurance  */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="text-[#c4f080]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
              </div>
              <h3 className="text-xl font-semibold text-white">HatiInsurance</h3>
              <p className="text-sm text-white/70">Affordable cover for your health and assets, paid via mobile money.</p>
            </div>

          </div>
        </div>

          {/* Learn More Button */}
          <div className="pt-2">
            <Link 
              href="/learn-more" 
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white text-[#0a1f17] px-6 py-3 text-sm font-semibold hover:bg-gray-100 transition-colors w-full sm:w-auto"
            >
              Learn More 
            </Link>
          </div>

        </CardContent>
      </Card>
    </section>
  );
}