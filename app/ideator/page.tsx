"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function IdeatorPage() {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    socialHandle: "",
    track: "club", // NEW: Track selector
    startupName: "",
    category: "Agritech",
    tagline: "",
    description: "",
    problemVideoUrl: "", // NEW: YC style "About you" video
    demoVideoUrl: "", // NEW: "Show us the product" video
    targetMarket: "",
    businessModel: "",
    competitors: "",
    impact: "",
    spendFirst: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("ideas").insert([
      {
        founder_name: formData.fullName,
        startup_name: formData.startupName,
        category: formData.category,
        description: formData.description,
        video_url: formData.demoVideoUrl, // We save the demo video as the primary one for the DB
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

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
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
      {/* Top Navigation */}
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-8 space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Hati Startup Show: Pitch to Top Venture Capitalists & Angel Investors
        </h1>
        <p className="text-lg font-medium text-foreground/80">
          Top 20 Ideas Receive Funding on Fixed Terms. Next Top 30 Ideas Receive Funding on Dynamic Terms.
        </p>
        
        <div className="bg-card p-6 rounded-xl border border-border/80 shadow-sm space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            East Africa's biggest asset isn't oil or minerals—it's the youth. But the system is broken. Millions of brilliant ideas die in dorm rooms and on the streets because there is no capital, no coaching, and no clear path to execution.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Hati Startup Show is the bridge. We are bringing together the brightest minds, industry experts, and early-stage capital to scale the most compelling ideas in East Africa. This is where the next generation of African founders gets built.
          </p>
        </div>
      </div>

      {/* Application Form */}
      <div className="max-w-3xl mx-auto px-6">
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
      </div>
    </main>
  );
}