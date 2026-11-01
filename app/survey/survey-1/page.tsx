"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function Survey1Page() {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State for the survey questions
  const [formData, setFormData] = useState({
    borrowingHabit: "",
    loanPurpose: "",
    biggestBarrier: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // In Phase 2, we will save this to a 'survey_responses' table in Supabase
    // const { error } = await supabase.from("survey_responses").insert([...])

    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-sm border border-border/80 p-8 text-center space-y-4">
          <CheckCircle2 className="size-16 text-[#1b4a3a] mx-auto" />
          <h1 className="text-2xl font-bold">Survey Complete!</h1>
          <p className="text-muted-foreground">
            Thank you for sharing your financial habits. You have successfully completed the Hati Financial Identity curriculum and earned your points.
          </p>
          <Link href="/participate" className="mt-6 inline-block w-full bg-[#1b4a3a] text-white py-3 rounded-lg font-medium hover:bg-[#153a2e] transition-colors">
            Back to Participate
          </Link>
        </div>
      </main>
    );
  }

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
          <p className="text-sm font-semibold text-[#1b4a3a] uppercase tracking-wider mb-2">Hati Survey</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Financial Habits Assessment</h1>
          <p className="mt-2 text-gray-600">Help us understand your cash flow so we can tailor your Hati Trust Score.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-8">
          
          {/* Question 1 */}
          <div className="space-y-3">
            <label className="text-base font-medium text-foreground">How do you usually borrow money when you need cash quickly?</label>
            <select required name="borrowingHabit" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="friends_family">Friends & Family</option>
              <option value="mobile_loan">Mobile Loan Apps (Tala, Fuliza, etc.)</option>
              <option value="sacco">SACCO or VSLA</option>
              <option value="money_lender">Unregulated Money Lender</option>
              <option value="bank">Commercial Bank</option>
            </select>
          </div>

          {/* Question 2 */}
          <div className="space-y-3">
            <label className="text-base font-medium text-foreground">If you had a verified credit score, what would you primarily use a loan for?</label>
            <select required name="loanPurpose" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="business">Business capital or inventory</option>
              <option value="education">School fees or education</option>
              <option value="emergency">Medical or family emergency</option>
              <option value="farming">Farming inputs</option>
              <option value="asset">Buying an asset (bike, phone, etc.)</option>
            </select>
          </div>

          {/* Question 3 */}
          <div className="space-y-3">
            <label className="text-base font-medium text-foreground">What is the biggest barrier to your financial growth right now?</label>
            <select required name="biggestBarrier" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="capital">Lack of access to capital</option>
              <option value="knowledge">Lack of financial knowledge</option>
              <option value="income">Lack of a stable income stream</option>
              <option value="debt">Existing predatory debt</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1b4a3a] text-white text-lg font-semibold py-4 rounded-xl hover:bg-[#153a2e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md mt-4"
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"} <ChevronRight className="size-5" />
          </button>
        </form>
      </div>
    </main>
  );
}