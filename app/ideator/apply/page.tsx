"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase";

type Idea = {
  id: string | number;
  startup_name: string;
  full_name: string;
  votes: number;
};

export default function ApplyPage() {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State for the Top 10 Ideas leaderboard
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(true);
  const [votingId, setVotingId] = useState<Idea["id"] | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    socialHandle: "",
    track: "club",
    startupName: "",
    category: "Agritech",
    tagline: "",
    description: "",
    problemVideoUrl: "",
    demoVideoUrl: "",
    targetMarket: "",
    businessModel: "",
    competitors: "",
    impact: "",
    spendFirst: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch Top 10 Ideas
  const loadIdeas = useCallback(async () => {
    const { data, error } = await supabase
      .from("ideas")
      .select("id, startup_name, full_name, votes")
      .order("votes", { ascending: false })
      .limit(10);

    if (!error) {
      setIdeas((data ?? []) as Idea[]);
    }
    setLoadingIdeas(false);
  }, [supabase]);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from("ideas").insert([
      {
        founder_name: formData.fullName,
        startup_name: formData.startupName,
        category: formData.category,
        description: formData.description,
        video_url: formData.demoVideoUrl,
        votes: 0,
      },
    ]);
    setIsSubmitting(false);
    if (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } else {
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      loadIdeas(); // Refresh the leaderboard
    }
  };

  const handleVote = async (idea: Idea) => {
    setVotingId(idea.id);
    const { data, error } = await supabase
      .from("ideas")
      .update({ votes: idea.votes + 1 })
      .eq("id", idea.id)
      .select("votes")
      .single();

    setVotingId(null);

    if (!error && data) {
      setIdeas((current) =>
        current
          .map((i) => (i.id === idea.id ? { ...i, votes: data.votes } : i))
          .sort((a, b) => b.votes - a.votes)
      );
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-sm border border-border/80 p-8 text-center space-y-4">
          <CheckCircle2 className="size-16 text-[#1b4a3a] mx-auto" />
          <h1 className="text-2xl font-bold">Application Received!</h1>
          <p className="text-muted-foreground">
            Thank you, {formData.fullName.split(" ")[0]}. Your pitch for <strong>{formData.startupName}</strong> has been submitted to the Hati Startup Show. Keep an eye on your email for next steps.
          </p>
          <Link href="/dashboard" className="mt-6 inline-block w-full bg-[#1b4a3a] text-white py-3 rounded-lg font-medium hover:bg-[#153a2e] transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/ideator" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Startup Show 
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#1b4a3a]">Hati Startup Show Application</h1>
          <p className="mt-2 text-gray-600">Fill out all sections to complete your submission.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: The Founder */}
          <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
            <div className="border-b border-border/80 pb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                <span className="bg-[#1b4a3a] text-white size-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                The Founder
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Tell us about yourself.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select Your Track</label>
              <select name="track" onChange={handleChange} className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all">
                <option value="club">Club Track (University Students & Alumni)</option>
                <option value="individual">Individual Track (Tier III Solo Founders)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input required name="fullName" onChange={handleChange} type="text" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input required name="email" onChange={handleChange} type="email" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="jane@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <input required name="phone" onChange={handleChange} type="tel" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="+256 700 000 000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">LinkedIn Profile</label>
                <input name="socialHandle" onChange={handleChange} type="text" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="https://www.linkedin.com/in/yourhandle" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-foreground">Video 1: Tell us about yourself and the problem you are solving (1 min)</label>
              <input required name="problemVideoUrl" onChange={handleChange} type="url" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="https://loom.com/share/..." />
            </div>
          </section>

          {/* Section 2: The Idea */}
          <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
            <div className="border-b border-border/80 pb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                <span className="bg-[#1b4a3a] text-white size-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                The Idea
              </h2>
              <p className="text-sm text-muted-foreground mt-1">What are you building?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Startup Name</label>
                <input required name="startupName" onChange={handleChange} type="text" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="e.g. AgriLink" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <select name="category" onChange={handleChange} className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all">
                  <option value="Agritech">Agritech</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Edtech">Edtech</option>
                  <option value="Healthtech">Healthtech</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Describe your startup in 50 characters or less</label>
              <input required name="tagline" onChange={handleChange} type="text" maxLength={50} className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="e.g. Uber for tractors in rural Uganda" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">What problem are you solving and how does your product work?</label>
              <textarea required name="description" onChange={handleChange} rows={4} className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="Explain your solution clearly..."></textarea>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-foreground">Video 2: Show us a demo of your product (1 min)</label>
              <input required name="demoVideoUrl" onChange={handleChange} type="url" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="https://loom.com/share/..." />
            </div>
          </section>

          {/* Section 3: The Business */}
          <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
            <div className="border-b border-border/80 pb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                <span className="bg-[#1b4a3a] text-white size-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                The Business
              </h2>
              <p className="text-sm text-muted-foreground mt-1">How will you make money?</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Who is your target market and how big is it?</label>
              <textarea required name="targetMarket" onChange={handleChange} rows={3} className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="e.g. 50,000 smallholder farmers in Uganda..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">What is your business model?</label>
              <textarea required name="businessModel" onChange={handleChange} rows={3} className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="e.g. We take a 10% commission on every transaction..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Who are your competitors and what is your unfair advantage?</label>
              <textarea required name="competitors" onChange={handleChange} rows={3} className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="e.g. Our competitors are X and Y, but we have exclusive partnerships with..."></textarea>
            </div>
          </section>

          {/* Section 4: The Hati Vision */}
          <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
            <div className="border-b border-border/80 pb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                <span className="bg-[#1b4a3a] text-white size-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                The Hati Vision
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Why does this matter?</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">How will your startup create jobs or improve financial well-being in East Africa?</label>
              <textarea required name="impact" onChange={handleChange} rows={3} className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="Explain your social impact..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">If you secure the funding, what is the immediate problem you will address?</label>
              <input required name="spendFirst" onChange={handleChange} type="text" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a] focus:border-transparent transition-all" placeholder="e.g. Hiring 2 senior engineers..." />
            </div>
          </section>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1b4a3a] text-white text-lg font-semibold py-4 rounded-xl hover:bg-[#153a2e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"} <ChevronRight className="size-5" />
          </button>
        </form>

        {/* Top 10 Ideas Section (Merged from second code) */}
        <section className="mt-16 border-t border-border/80 pt-8">
          <h2 className="text-2xl font-bold text-[#1b4a3a] mb-4">Top 10 Ideas</h2>

          {loadingIdeas ? (
            <p className="text-sm text-muted-foreground">Loading ideas...</p>
          ) : ideas.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ideas yet. Be the first to apply.</p>
          ) : (
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas.map((idea, i) => (
                <li
                  key={idea.id}
                  className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 shadow-sm"
                >
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground tabular-nums">#{i + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">{idea.startup_name}</h3>
                    <p className="text-sm text-gray-600">by {idea.full_name}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                    <span className="text-sm font-medium tabular-nums text-muted-foreground">
                      {idea.votes} {idea.votes === 1 ? "vote" : "votes"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleVote(idea)}
                      disabled={votingId === idea.id}
                      className="rounded-md border border-[#1b4a3a] text-[#1b4a3a] px-4 py-1.5 text-sm font-medium transition hover:bg-[#1b4a3a] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Vote
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

      </div>
    </main>
  );
}