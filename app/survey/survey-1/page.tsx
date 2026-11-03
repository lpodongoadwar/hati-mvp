"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/db";

export default function Survey1Page() {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // State for the 10 survey questions
  const [formData, setFormData] = useState({
    borrowingHabit: "",
    loanPurpose: "",
    biggestBarrier: "",
    incomeFrequency: "",
    monthlyIncome: "",
    savingsHabit: "",
    mobileMoneyUse: "",
    dependents: "",
    businessType: "",
    financialGoal: "",
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
          <Link href="/survey" className="mt-6 inline-block w-full bg-[#1b4a3a] text-white py-3 rounded-lg font-medium hover:bg-[#153a2e] transition-colors">
            Back to Survey
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 font-sans">
      <div className="bg-card border-b border-border/80">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/survey" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 size-4" /> Back to Survey
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-8">
        <div>
          <p className="text-sm font-semibold text-[#1b4a3a] uppercase tracking-wider mb-2">Hati Survey</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Financial Habits Assessment</h1>
          <p className="mt-2 text-gray-600">Help us understand your cash flow so we can tailor your Hati Trust Score.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
          
          {/* Q1 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">1. How do you usually borrow money when you need cash quickly?</label>
            <select required name="borrowingHabit" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="friends_family">Friends & Family</option>
              <option value="mobile_loan">Mobile Loan Apps (Tala, Fuliza, etc.)</option>
              <option value="sacco">SACCO or VSLA</option>
              <option value="money_lender">Unregulated Money Lender</option>
              <option value="bank">Commercial Bank</option>
            </select>
          </div>

          {/* Q2 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">2. If you had a verified credit score, what would you primarily use a loan for?</label>
            <select required name="loanPurpose" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="business">Business capital or inventory</option>
              <option value="education">School fees or education</option>
              <option value="emergency">Medical or family emergency</option>
              <option value="farming">Farming inputs</option>
              <option value="asset">Buying an asset (bike, phone, etc.)</option>
            </select>
          </div>

          {/* Q3 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">3. What is the biggest barrier to your financial growth right now?</label>
            <select required name="biggestBarrier" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="capital">Lack of access to capital</option>
              <option value="knowledge">Lack of financial knowledge</option>
              <option value="income">Lack of a stable income stream</option>
              <option value="debt">Existing predatory debt</option>
            </select>
          </div>

          {/* Q4 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">4. How often do you receive income (salary, business profits, etc.)?</label>
            <select required name="incomeFrequency" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="irregular">Irregular / Seasonal</option>
              <option value="none">I currently have no income</option>
            </select>
          </div>

          {/* Q5 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">5. What is your estimated monthly income?</label>
            <select required name="monthlyIncome" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="under_100k">Under UGX 100,000</option>
              <option value="100k_300k">UGX 100,000 - 300,000</option>
              <option value="300k_1m">UGX 300,000 - 1,000,000</option>
              <option value="over_1m">Over UGX 1,000,000</option>
            </select>
          </div>

          {/* Q6 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">6. How much of your monthly income are you able to save?</label>
            <select required name="savingsHabit" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="none">I cannot save anything right now</option>
              <option value="less_10">Less than 10%</option>
              <option value="10_30">10% - 30%</option>
              <option value="over_30">More than 30%</option>
            </select>
          </div>

          {/* Q7 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">7. How frequently do you use Mobile Money for transactions?</label>
            <select required name="mobileMoneyUse" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="daily">Multiple times a day</option>
              <option value="weekly">A few times a week</option>
              <option value="rarely">Rarely</option>
              <option value="never">Never</option>
            </select>
          </div>

          {/* Q8 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">8. How many people depend on your income (children, family, etc.)?</label>
            <select required name="dependents" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="0">None, I only support myself</option>
              <option value="1_3">1 - 3 people</option>
              <option value="4_6">4 - 6 people</option>
              <option value="7_plus">7 or more people</option>
            </select>
          </div>

          {/* Q9 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">9. Do you own or operate a business?</label>
            <select required name="businessType" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="none">No, I am employed or a student</option>
              <option value="informal">Yes, an informal business (market stall, boda, etc.)</option>
              <option value="formal">Yes, a formally registered business</option>
              <option value="farming">Yes, I am a farmer</option>
            </select>
          </div>

          {/* Q10 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">10. What is your primary financial goal for the next 12 months?</label>
            <select required name="financialGoal" onChange={handleChange} defaultValue="" className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]">
              <option value="" disabled>Select an option</option>
              <option value="start_business">Start or expand a business</option>
              <option value="education">Pay for education</option>
              <option value="asset">Buy an asset (land, vehicle, equipment)</option>
              <option value="emergency_fund">Build an emergency savings fund</option>
              <option value="debt">Pay off existing debt</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1b4a3a] text-white text-lg font-semibold py-4 rounded-xl hover:bg-[#153a2e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md mt-6"
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"} <ChevronRight className="size-5" />
          </button>
        </form>
      </div>
    </main>
  );
}