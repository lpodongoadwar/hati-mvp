import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, Building2 } from "lucide-react";

export default function SurveyHubPage() {
  const surveys = [
    {
      id: "survey-1",
      name: "Hati Financial Assessment",
      description: "Help us understand your cash flow to calibrate your Hati Trust Score.",
      status: "active",
      href: "/survey/survey-1",
    },
    {
      id: "survey-2",
      name: "MTN Mobile Money",
      description: "Share your experience with MoMo data bundles and mobile loans.",
      status: "coming_soon",
      href: "#",
    },
    {
      id: "survey-3",
      name: "dFCU Bank",
      description: "Tell us what you look for in a savings account or business loan.",
      status: "coming_soon",
      href: "#",
    },
    {
      id: "survey-4",
      name: "Airtel Uganda",
      description: "Help us improve mobile financial services in your region.",
      status: "coming_soon",
      href: "#",
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/participate" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Participate
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1b4a3a]">Partner Surveys</h1>
          <p className="mt-2 text-gray-600">
            Complete surveys from our enterprise partners. Every completed survey boosts your Hati Trust Score and helps shape better financial products for East Africa.
          </p>
        </div>

        <div className="space-y-4">
          {surveys.map((survey) => (
            <div 
              key={survey.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border ${
                survey.status === 'coming_soon' 
                  ? 'bg-muted/50 border-border/50 opacity-75' 
                  : 'bg-card border-border/80 shadow-sm hover:border-[#1b4a3a]/50 transition-colors'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full shrink-0 ${
                  survey.status === 'coming_soon' 
                    ? 'bg-muted text-muted-foreground' 
                    : 'bg-[#1b4a3a]/10 text-[#1b4a3a]'
                }`}>
                  {survey.status === 'coming_soon' ? <Lock className="size-6" /> : <Building2 className="size-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{survey.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 max-w-md">{survey.description}</p>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-4 shrink-0">
                {survey.status === 'coming_soon' ? (
                  <span className="inline-flex items-center text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-md">
                    Coming Soon
                  </span>
                ) : (
                  <Link 
                    href={survey.href}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#153a2e] transition-colors w-full sm:w-auto"
                  >
                    Start Survey
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}