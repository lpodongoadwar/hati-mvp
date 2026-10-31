'use client'

import { Badge } from '@/components/ui/badge'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { Pie, PieChart } from 'recharts'

const MAX_SCORE = 850

const scoreChartConfig = {
  score: {
    label: 'Hati Score',
    color: '#1b4a3a', // Updated to Hati Green
  },
  remaining: {
    label: 'Remaining',
    color: '#e5e1d8', // A light cream/grey for the empty part of the gauge
  },
} satisfies ChartConfig

function getTier(score: number) {
  if (score < 500) {
    return { label: 'Tier I', range: '0 to 499' }
  }

  if (score < 650) {
    return { label: 'Tier II', range: '500 to 649' }
  }

  return { label: 'Tier III', range: '650 to 850' }
}

export function HatiScoreGauge({ score }: { score: number }) {
  const currentScore = Math.max(0, Math.min(Math.round(score), MAX_SCORE))
  const tier = getTier(currentScore)
  const chartData = [
    { name: 'score', value: currentScore, fill: 'var(--color-score)' },
    {
      name: 'remaining',
      value: MAX_SCORE - currentScore,
      fill: 'var(--color-remaining)',
    },
  ]

  return (
    <figure className="mx-auto w-full max-w-[340px]">
      <div className="relative">
        <ChartContainer
          aria-hidden="true"
          className="mx-auto aspect-auto h-[248px] w-full max-w-[340px]"
          config={scoreChartConfig}
          initialDimension={{ width: 320, height: 248 }}
        >
          <PieChart>
            <Pie
              cornerRadius={12}
              data={chartData}
              dataKey="value"
              endAngle={-45}
              innerRadius={91}
              isAnimationActive={false}
              nameKey="name"
              outerRadius={114}
              startAngle={225}
              stroke="none"
            />
          </PieChart>
        </ChartContainer>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-1"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Hati Score
          </span>
          <span className="mt-1 text-6xl font-semibold leading-none tracking-[-0.08em] text-foreground tabular-nums">
            {currentScore}
          </span>
          <Badge className="mt-3" variant="secondary">
            {tier.label}
          </Badge>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="-mt-5 flex justify-between px-8 text-xs font-medium tabular-nums text-muted-foreground"
      >
        <span>0</span>
        <span>{MAX_SCORE}</span>
      </div>
      <figcaption className="sr-only">
        Hati Score {currentScore} out of {MAX_SCORE}. {tier.label} covers scores{' '}
        {tier.range}.
      </figcaption>
    </figure>
  )
}