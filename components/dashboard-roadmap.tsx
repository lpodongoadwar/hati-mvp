import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

const milestones = [
  {
    tier: 'Tier I',
    range: '0–499',
    action: 'Build your first income stream',
    current: true,
  },
  {
    tier: 'Tier II',
    range: '500–649',
    action: 'Build your second income stream',
    current: false,
  },
  {
    tier: 'Tier III',
    range: '650–850',
    action: 'Build an enterprise',
    current: false,
  },
] as const

export function DashboardRoadmap() {
  return (
    <section aria-labelledby="roadmap-title">
      <Card className="h-full rounded-[26px] border-border/80 bg-card shadow-[0_24px_70px_-44px_rgba(31,70,48,0.3)] sm:[--card-spacing:--spacing(6)]">
        <CardHeader>
          <CardTitle
            aria-level={2}
            id="roadmap-title"
            role="heading"
            className="text-xl font-semibold tracking-[-0.04em]"
          >
            Your roadmap
          </CardTitle>
          <CardDescription className="leading-6">
            A clear path to your next income milestone.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <ol aria-label="Hati Score tiers" className="flex flex-col gap-3">
            {milestones.map((milestone, index) => (
              <li
                key={milestone.tier}
                aria-current={milestone.current ? 'step' : undefined}
                className={cn(
                  'rounded-2xl border p-4 transition-colors sm:p-5',
                  milestone.current
                    ? 'border-primary/25 bg-secondary/55'
                    : 'border-border/70 bg-background/50',
                )}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums',
                      milestone.current
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {milestone.tier}
                      </span>
                      {milestone.current ? (
                        <Badge variant="secondary">Current</Badge>
                      ) : null}
                      <span className="ml-auto text-xs font-medium tabular-nums text-muted-foreground">
                        {milestone.range}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-foreground">
                      {milestone.action}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </section>
  )
}
