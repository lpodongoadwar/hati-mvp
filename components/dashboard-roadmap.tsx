import { CheckCircle2 } from "lucide-react";

// Define the interface to accept the score prop
interface DashboardRoadmapProps {
  score?: number;
}

export function DashboardRoadmap({ score = 200 }: DashboardRoadmapProps) {
  // Determine the current tier based on the score
  const currentTier = score < 500 ? 1 : score < 650 ? 2 : 3;

  const tiers = [
    {
      id: 1,
      title: "Tier I",
      description: "Build your first income stream",
    },
    {
      id: 2,
      title: "Tier II",
      description: "Build your second income stream",
    },
    {
      id: 3,
      title: "Tier III",
      description: "Build an enterprise",
    },
  ];

  return (
    <section aria-labelledby="roadmap-title" className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight" id="roadmap-title">
          Your roadmap
        </h2>
        <p className="text-muted-foreground">
          A clear path to your next income milestone.
        </p>
      </div>

      <div className="space-y-3">
        {tiers.map((tier) => {
          const isCurrent = tier.id === currentTier;
          const isPast = tier.id < currentTier;

          return (
            <div
              key={tier.id}
              className={`flex items-start gap-4 rounded-2xl border p-5 transition-colors ${
                isCurrent
                  ? "border-[#1b4a3a] bg-[#fcfaf6] shadow-sm"
                  : isPast
                  ? "border-green-200 bg-green-50/30"
                  : "border-border/60 bg-card opacity-60"
              }`}
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full font-semibold ${
                  isCurrent
                    ? "bg-[#1b4a3a] text-white"
                    : isPast
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isPast ? <CheckCircle2 className="size-5" /> : `0${tier.id}`}
              </div>

              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{tier.title}</h3>
                  {isCurrent && (
                    <span className="inline-flex items-center rounded-full bg-[#1b4a3a]/10 px-2.5 py-0.5 text-xs font-medium text-[#1b4a3a]">
                      Current
                    </span>
                  )}
                  {isPast && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {tier.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}