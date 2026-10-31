"use client"
import { ArrowUpRight, Lightbulb, UsersRound } from 'lucide-react'
import  Link from 'next/link'
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Badge } from '@/components/ui/badge'
export function CampusBlitzBanner() {
  const router = useRouter()
  return (
    <section aria-labelledby="campus-blitz-title">
      <Card className="overflow-hidden rounded-[26px] border-transparent bg-primary text-primary-foreground shadow-[0_24px_70px_-38px_rgba(31,70,48,0.5)]">
        <CardHeader className="gap-3 px-6 sm:px-8">
          <Badge
            className="h-6 w-fit border-primary-foreground/25 bg-primary-foreground/10 px-3 text-[10px] font-semibold tracking-[0.18em] text-primary-foreground"
            variant="outline"
          >
            HATI AMBASSADORS PROGRAM
          </Badge>
          <CardTitle
            aria-level={2}
            className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl"
            id="campus-blitz-title"
            role="heading"
          >
            Compete in the Hati Ambassadors Program 
          </CardTitle>
          <CardDescription className="max-w-xl text-sm leading-6 text-primary-foreground/75 sm:text-base">
            Bring your skills together and turn bold ideas into campus momentum.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
          <p
            className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/75"
            id="campus-blitz-role-label"
          >
            Choose your role
          </p>
          <ToggleGroup
            aria-labelledby="campus-blitz-role-label"
            className="w-full max-w-lg"
            defaultValue={[]}
            size="lg"
            spacing={3}
            variant="outline"
          >
            <ToggleGroupItem
              className="h-12 flex-1 justify-between border-primary-foreground/25 bg-primary-foreground/5 px-4 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground aria-pressed:bg-primary-foreground aria-pressed:text-primary data-[state=on]:bg-primary-foreground data-[state=on]:text-primary"
              value="mobilizer"
            onClick={() => router.push('/leaderboard')}>
              <span className="flex items-center gap-2">
                <UsersRound aria-hidden="true" data-icon="inline-start" />
                Mobilizer
              </span>
              <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
            </ToggleGroupItem>
            <ToggleGroupItem
              className="h-12 flex-1 justify-between border-primary-foreground/25 bg-primary-foreground/5 px-4 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground aria-pressed:bg-primary-foreground aria-pressed:text-primary data-[state=on]:bg-primary-foreground data-[state=on]:text-primary"
              value="ideator"
            onClick={() => router.push('/ideator')}>
              <span className="flex items-center gap-2">
                <Lightbulb aria-hidden="true" data-icon="inline-start" />
                Ideator
              </span>
              <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
            </ToggleGroupItem>
          </ToggleGroup>
        </CardContent>
      </Card>
    </section>
  )
}
