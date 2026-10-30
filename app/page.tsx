import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'
import { CreditScoreForm } from '../components/credit-score-form'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between py-5 sm:py-6">
          <a
            aria-label="Hati home"
            className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25"
            href="/"
          >
            <Image
              alt="Hati"
              className="h-[50px] w-[124px] object-cover object-center mix-blend-darken"
              height={395}
              priority
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_0000000026b481f4ac4092f29fa586e7%20%281%29.png-aEG4UagFYjCgRKM7hpezKdtI5qDLCJ.jpeg"
              unoptimized
              width={765}
            />
          </a>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2">
            <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
            <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
              UGANDA
            </span>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-9 pb-10 pt-6 sm:grid-cols-[minmax(0,0.95fr)_minmax(280px,1fr)] sm:gap-6 sm:py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.9fr)] lg:gap-20 lg:py-14">
          <section aria-labelledby="hero-title" className="max-w-2xl min-w-0">
            <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
              <span aria-hidden="true" className="h-px w-7 bg-primary" />
              A clearer view of your finances
            </p>
            <h1
              className="mt-5 text-[clamp(3rem,6.3vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-foreground sm:text-[clamp(2.5rem,5vw,4.5rem)] lg:text-[clamp(4rem,6.3vw,5.5rem)]"
              id="hero-title"
            >
              <span className="block">Get Your</span>
              <span className="block">Credit Score.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
              Know where you stand and take your next money move with more
              confidence.
            </p>
            <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-3 sm:mt-9 sm:gap-2.5 sm:px-3">
              <span className="text-sm font-medium text-foreground">
                Your credit score is private and secure. 
                We never share your credit score with anyone without your permission.
              </span>
            </div>
          </section>

          <section
            aria-labelledby="details-title"
            className="w-full rounded-[26px] border border-border bg-card p-5 shadow-[0_24px_70px_-38px_rgba(31,70,48,0.28)] sm:rounded-[30px] sm:p-5 lg:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4 sm:mb-5 lg:mb-7">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[11px]">
                  CREDIT PROFILE
                </p>
                <h2
                  className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground sm:text-[1.7rem]"
                  id="details-title"
                >
                  Your details
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  A few details to get started.
                </p>
              </div>
              <span className="hidden size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary sm:flex">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
            </div>
            <CreditScoreForm />
          </section>
        </div>

        <footer className="border-t border-border/80 py-4 text-xs text-muted-foreground sm:py-5">
          <p>© 2026 Hati, Inc. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  )
}
