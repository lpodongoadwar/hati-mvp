'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent } from 'react'
import { ArrowUpRight, LockKeyhole } from 'lucide-react'

const inputClassName =
  'h-12 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-ring/15'
  import { createClient } from '@/lib/supabase';
// The Hati Trust Score Logic
function calculateHatiScore(nin: string, hasUsername: boolean) {
  let score = 200; // Base Score

  // Pillar 1: Identity & Security (Max 150)
  if (nin.length > 10) score += 75; // NIN Verified
  score += 75; // Owns SIM (Assuming they checked the box, we will hook this up next)

  // Pillar 2: Financial Commitment (Max 300)
  // We assume they are paying the 2,000 fee to submit
  score += 100; // Paid fee

  return score;
}
export function CreditScoreForm() {
  const router = useRouter()
const supabase = createClient();
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const calculatedScore = calculateHatiScore("12345678901234", true);
    // (We will pass the real NIN state here later)
    // Save to Supabase
const { error } = await supabase
  .from('profiles')
  .insert([
    { 
      full_name: "Test User", // We will connect the real input later
      team: 'red', 
      referral_count: 0 
    }
  ]);

if (!error) {
  router.push('/dashboard');
} else {
  console.error(error);
  alert("Something went wrong saving your profile.");
}
    router.push('/dashboard')
  }

  return (
    <form
      aria-label="Credit score request"
      autoComplete="off"
      className="flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          className="mb-2 block text-sm font-medium text-foreground"
          htmlFor="phone-number"
        >
          Phone number
        </label>
        <div className="flex h-12 overflow-hidden rounded-xl border border-input bg-background shadow-sm transition focus-within:border-primary focus-within:ring-4 focus-within:ring-ring/15">
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center border-r border-border px-3.5 text-sm font-medium text-muted-foreground"
          >
            +256
          </span>
          <input
            autoComplete="tel-national"
            className="min-w-0 flex-1 border-0 bg-transparent px-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            id="phone-number"
            inputMode="tel"
            placeholder="7XX XXX XXX"
            required
            type="tel"
          />
        </div>
      </div>
<div className="space-y-2">
  <label className="text-sm font-medium">Username</label>
  <input 
    type="text" 
    placeholder="Choose a username" 
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
  />
</div>
<div className="space-y-2">
  <label className="text-sm font-medium">Password</label>
  <input 
    type="password" 
    placeholder="Create a password" 
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
  />
</div>
      <div>
        <label
          className="mb-2 block text-sm font-medium text-foreground"
          htmlFor="email-address"
        >
          Email
        </label>
        <input
          autoComplete="email"
          className={inputClassName}
          id="email-address"
          inputMode="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-medium text-foreground"
          htmlFor="national-id"
        >
          National Identification Number (NIN)
        </label>
        <input
          autoComplete="off"
          className={inputClassName}
          id="national-id"
          placeholder="Enter your NIN"
          required
          spellCheck={false}
          type="text"
        />
      </div>
      <div className="space-y-2 mt-4">
  <label className="text-sm font-medium">Upload Mini Statement (PDF)</label>
  <input 
    type="file" 
    accept=".pdf" 
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium" 
    required
  />
  <p className="text-xs text-muted-foreground">
    Dial *165*8*4*2# and select duration (choose 90 days or more) / download from the MoMo App (MTN) OR *185*10*3# and select duration (choose 90 days or more) / download from the MyAirtel App (Airtel) and to get this PDF.
  </p>
</div>
<div className="space-y-2 mt-4">
      <label className="text-sm font-medium">Social Media Handle (optional, add as many as you like)</label>
      <input 
        type="text" 
        placeholder="@yourhandle or link (X, TikTok, IG)" 
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
      />
      <p className="text-xs text-muted-foreground">
        We'll follow you.
      </p>
    </div>  
<div className="flex items-center gap-2 mt-2">
  <input
  className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded border-primary accent-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:ring-offset-2" 
  required 
  type="checkbox" 
  id="terms"
/>
  <label htmlFor="terms" className="text-sm text-muted-foreground">
    I agree to the <a href="/terms" className="underline font-medium text-[#1b4a3a]">Terms & Conditions</a>
  </label>
</div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-foreground">
        <input
          className="mt-0.5 size-[18px] shrink-0 cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:ring-offset-2"
          required
          type="checkbox"
        />
        <span>I confirm I control this phone number</span>
      </label>

      <button
        className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3.5 text-left text-sm font-semibold text-primary-foreground shadow-[0_10px_22px_-12px_rgba(31,70,48,0.65)] transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 focus-visible:ring-offset-2 active:translate-y-px sm:px-5 sm:text-base"
        type="submit"
      >
        <span>Unlock Score for UGX 2,000.</span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10 transition-transform group-hover:translate-x-0.5">
          <ArrowUpRight aria-hidden="true" className="size-[18px]" />
        </span>
      </button>
<div className="text-center text-sm mt-6">
  <p className="text-muted-foreground">
    Already have an account?{" "}
    <a href="/login" className="font-semibold underline text-[#1b4a3a]">
      Log in
    </a>
  </p>
</div>
</form>
  );
}