"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Lock, CheckCircle2, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function CurriculumPage() {
  const supabase = createClient();
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("completed_modules")
          .eq("id", user.id)
          .single();
        
        if (data && data.completed_modules) {
          setCompletedModules(data.completed_modules);
        }
      }
      setLoading(false);
    }
    fetchProgress();
  }, [supabase]);

  const modules = [
    {
      id: "module-1",
      title: "The Status Quo",
      description: "Understand the credit gap in Uganda and why traditional banking excludes you.",
      href: "/curriculum/module-1",
      completed: completedModules.includes("module-1"),
      locked: false, // Module 1 is always unlocked
    },
    {
      id: "module-2",
      title: "The Mechanics of Credit",
      description: "Learn what a credit score is, how it's calculated, and why it matters.",
      href: "/curriculum/module-2",
      completed: completedModules.includes("module-2"),
      locked: !completedModules.includes("module-1"), // Locked until Module 1 is done
    },
    {
      id: "module-3",
      title: "The Hati Ecosystem & SWEP",
      description: "Discover how 'Save With Every Purchase' builds your collateral and unlocks the Ambassadors Program.",
      href: "/curriculum/module-3",
      completed: completedModules.includes("module-3"),
      locked: !completedModules.includes("module-2"), // Locked until Module 2 is done
    }
  ];

  if (loading) return <div className="p-10 text-center">Loading curriculum...</div>;

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
          <h1 className="text-4xl font-bold tracking-tight text-[#1b4a3a]">Hati Financial Identity</h1>
          <p className="mt-2 text-lg text-gray-600">Complete this 3-part curriculum to prove your financial discipline and boost your Hati Trust Score.</p>
        </div>

        <div className="space-y-4">
          {modules.map((module) => (
            <div 
              key={module.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border ${module.locked ? 'bg-muted/50 border-border/50 opacity-75' : 'bg-card border-border/80 shadow-sm hover:border-[#1b4a3a]/50 transition-colors'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full shrink-0 ${module.completed ? 'bg-green-100 text-green-700' : module.locked ? 'bg-muted text-muted-foreground' : 'bg-[#1b4a3a]/10 text-[#1b4a3a]'}`}>
                  {module.completed ? <CheckCircle2 className="size-6" /> : module.locked ? <Lock className="size-6" /> : <BookOpen className="size-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{module.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 max-w-md">{module.description}</p>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-4 shrink-0">
                {module.locked ? (
                  <span className="inline-flex items-center text-sm font-medium text-muted-foreground">Locked</span>
                ) : module.completed ? (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700">Completed</span>
                ) : (
                  <Link 
                    href={module.href}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#153a2e] transition-colors w-full sm:w-auto"
                  >
                    Start <ChevronRight className="size-4" />
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