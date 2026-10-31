import Link from "next/link";
import { ArrowUpRight, Lightbulb, UsersRound, ShoppingBag, ShieldCheck, Plane, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CampusBlitzBanner() {
  return (
    <section aria-labelledby="campus-blitz-title" className="space-y-4">
      <Card className="overflow-hidden rounded-[26px] border-transparent bg-[#0a1f17] text-white shadow-[0_24px_70px_-44px_rgba(31,70,48,0.5)] sm:[--card-spacing:--spacing(8)]">
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
            Bring your skills together and turn bold ideas into campus momentum.
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

          {/* Coming Soon Products */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Coming Soon to Hati
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg bg-white/5 p-4 border border-white/10">
                <ShoppingBag className="size-5 text-[#c4f080] mb-2" />
                <h4 className="font-semibold text-sm">Hati Market</h4>
                <p className="text-xs text-white/70 mt-1">Save with every purchase.</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4 border border-white/10">
                <ShieldCheck className="size-5 text-[#c4f080] mb-2" />
                <h4 className="font-semibold text-sm">Hati Insurance</h4>
                <p className="text-xs text-white/70 mt-1">Micro-cover for your assets and health.</p>
              </div>
              <div className="rounded-lg bg-white/5 p-4 border border-white/10">
                <Plane className="size-5 text-[#c4f080] mb-2" />
                <h4 className="font-semibold text-sm">Hati Travel</h4>
                <p className="text-xs text-white/70 mt-1">Turn your savings into real experiences.</p>
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