"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight, XCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/db";

export default function ApplyPage() {
  const supabase = createClient();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Qualification State
  const [qualifications, setQualifications] = useState({
    score: 0,
    hasScore: false,
    hasSurveys: false,
    hasReferrals: false,
    isQualified: false,
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    socialHandle: "",
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

  // Check User Qualifications on Mount
  useEffect(() => {
    async function checkQualifications() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace("/login");
        return;
      }

      // Fetch Profile Data (Score & Referrals)
      const { data: profile } = await supabase
        .from("profiles")
        .select("score, referral_count, completed_modules")
        .eq("id", user.id)
        .single();

      const score = profile?.score || 0;
      const referrals = profile?.referral_count || 0;
      const completedModules = profile?.completed_modules || [];

      // Check Surveys (Assuming surveys are stored in a 'surveys' table or as specific module IDs)
      // For this example, we will assume the user needs to have completed specific survey IDs
      // Replace these IDs with your actual survey identifiers
      const requiredSurveys = ["hati_survey", "mtn_survey", "airtel_survey", "bank_survey"];
      const hasSurveys = requiredSurveys.every(survey => completedModules.includes(survey));

      const hasScore = score >= 650;
      const hasReferrals = referrals >= 5;
      const isQualified = hasScore && hasSurveys && hasReferrals;

      setQualifications({
        score,
        hasScore,
        hasSurveys,
        hasReferrals,
        isQualified,
      });
      
      setLoading(false);
    }
    
    checkQualifications();
  }, [supabase, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qualifications.isQualified) {
      alert("You must meet all qualification criteria before submitting.");
      return;
    }

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
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Checking your eligibility...</div>;
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-sm border border-border/80 p-8 text-center space-y-4">
          <CheckCircle2 className="size-16 text-[#1b4a3a] mx-auto" />
          <h1 className="text-2xl font-bold">Application Received!</h1>
          <p className="text-muted-foreground">
            Thank you, {formData.fullName.split(" ")[0]}. Your pitch for <strong>{formData.startupName}</strong> has been submitted.
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
          <Link href="/leaderboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Leaderboard
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#1b4a3a]">Hati Startup Show Application</h1>
          <p className="mt-2 text-gray-600">Fill out all sections to complete your submission.</p>
        </div>

        {/* QUALIFICATION STATUS CARD */}
        <div className={`p-6 rounded-2xl border mb-8 ${qualifications.isQualified ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-start gap-4">
            {qualifications.isQualified ? (
              <CheckCircle2 className="size-6 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="size-6 text-yellow-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-2 w-full">
              <h2 className={`font-semibold text-lg ${qualifications.isQualified ? 'text-green-800' : 'text-yellow-800'}`}>
                {qualifications.isQualified ? "You Qualify to Pitch!" : "Complete the Following Tasks to Qualify"}
              </h2>
              
              {!qualifications.isQualified && (
                <ul className="space-y-2 text-sm mt-2">
                  <li className="flex items-center gap-2">
                    {qualifications.hasScore ? <CheckCircle2 className="size-4 text-green-600" /> : <XCircle className="size-4 text-red-500" />}
                    <span className={qualifications.hasScore ? "text-green-700" : "text-gray-700"}>
                      Reach a Hati Trust Score of 650+ (Current: {qualifications.score})
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {qualifications.hasSurveys ? <CheckCircle2 className="size-4 text-green-600" /> : <XCircle className="size-4 text-red-500" />}
                    <span className={qualifications.hasSurveys ? "text-green-700" : "text-gray-700"}>
                      Complete all 4 primary surveys (Hati, MTN, Airtel, Bank)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {qualifications.hasReferrals ? <CheckCircle2 className="size-4 text-green-600" /> : <XCircle className="size-4 text-red-500" />}
                    <span className={qualifications.hasReferrals ? "text-green-700" : "text-gray-700"}>
                      Refer at least 5 people to the platform
                    </span>
                  </li>
                </ul>
              )}
              
              {qualifications.isQualified && (
                <p className="text-sm text-green-700 mt-1">
                  You have met all criteria. The form below is now unlocked. Good luck!
                </p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 opacity-100 transition-opacity">
          
          {/* Section 1: The Founder */}
          <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
            <div className="border-b border-border/80 pb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                <span className="bg-[#1b4a3a] text-white size-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                The Founder
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Tell us about yourself.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <input required name="fullName" onChange={handleChange} type="text" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <input required name="email" onChange={handleChange} type="email" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="jane@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <input required name="phone" onChange={handleChange} type="tel" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="+256 700 000 000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">LinkedIn Profile</label>
                <input name="socialHandle" onChange={handleChange} type="text" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="https://www.linkedin.com/in/yourhandle" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-foreground">Video 1: Tell us about yourself and the problem you are solving (1 min)</label>
              <input required name="problemVideoUrl" onChange={handleChange} type="url" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="https://loom.com/share/..." />
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
                <input required name="startupName" onChange={handleChange} type="text" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="e.g. AgriLink" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <select name="category" onChange={handleChange} className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
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
              <input required name="tagline" onChange={handleChange} type="text" maxLength={50} className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="e.g. Uber for tractors in rural Uganda" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">What problem are you solving and how does your product work?</label>
              <textarea required name="description" onChange={handleChange} rows={4} className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="Explain your solution clearly..."></textarea>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-foreground">Video 2: Show us a demo of your product (1 min)</label>
              <input required name="demoVideoUrl" onChange={handleChange} type="url" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="https://loom.com/share/..." />
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
              <textarea required name="targetMarket" onChange={handleChange} rows={3} className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="e.g. 50,000 smallholder farmers in Uganda..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">What is your business model?</label>
              <textarea required name="businessModel" onChange={handleChange} rows={3} className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="e.g. We take a 10% commission on every transaction..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Who are your competitors and what is your unfair advantage?</label>
              <textarea required name="competitors" onChange={handleChange} rows={3} className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="e.g. Our competitors are X and Y..."></textarea>
            </div>
          </section>

          {/* Section 4: The Vision */}
          <section className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
            <div className="border-b border-border/80 pb-4">
              <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
                <span className="bg-[#1b4a3a] text-white size-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                The Vision
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Why does this matter?</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">How will your startup create jobs or improve financial well-being in East Africa?</label>
              <textarea required name="impact" onChange={handleChange} rows={3} className="w-full p-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="Explain your social impact..."></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">If you secure the funding, what is the immediate problem you will address?</label>
              <input required name="spendFirst" onChange={handleChange} type="text" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]" placeholder="e.g. Hiring 2 senior engineers..." />
            </div>
          </section>

          <button 
            type="submit" 
            disabled={isSubmitting || !qualifications.isQualified}
            className={`w-full text-lg font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors ${
              qualifications.isQualified 
                ? "bg-[#1b4a3a] text-white hover:bg-[#153a2e] cursor-pointer" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } disabled:opacity-70`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"} <ChevronRight className="size-5" />
          </button>
        </form>
      </div>
    </main>
  );
}