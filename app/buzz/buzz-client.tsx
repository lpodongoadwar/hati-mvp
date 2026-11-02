"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

const supabase = createClient();

type BuzzEvent = {
  id: string | number;
  user_id: string;
  created_at: string;
};

export function BuzzClient({ question }: { question: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [first, setFirst] = useState<BuzzEvent | null>(null);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const [buzzing, setBuzzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The earliest buzz is the winner. Ordering by the database timestamp keeps
  // this fair even if two people press at nearly the same moment.
  const loadFirst = useCallback(async () => {
    const { data, error } = await supabase
      .from("buzz_events")
      .select("id, user_id, created_at")
      .order("created_at", { ascending: true })
      .limit(1);

    if (error) {
      setError("Couldn’t load buzz status. Check your connection.");
      return;
    }

    const event = ((data ?? [])[0] as BuzzEvent | undefined) ?? null;
    setFirst(event);

    if (!event) {
      setWinnerName(null);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", event.user_id)
      .maybeSingle();

    setWinnerName(profile?.full_name ?? null);
  }, []);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserId(data.user?.id ?? null);
      setAuthChecked(true);
    });

    loadFirst();

    // Re-check whenever anyone buzzes (or the table is cleared for a new round).
    const channel = supabase
      .channel("buzz-events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "buzz_events" },
        () => loadFirst()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [loadFirst]);

  async function handleBuzz() {
    if (!userId) return;
    setError(null);
    setBuzzing(true);

    // created_at is filled in by the database (default now()).
    const { error } = await supabase.from("buzz_events").insert({ user_id: userId });

    setBuzzing(false);
    if (error) {
      setError("Couldn’t register your buzz. Try again.");
      return;
    }
    await loadFirst();
  }

  const someoneBuzzed = first !== null;
  const iWon = someoneBuzzed && first.user_id === userId;
  const winnerLabel = iWon
    ? "You"
    : winnerName ?? (first ? `Player ${first.user_id.slice(0, 6)}` : "");

  const disabled = !userId || someoneBuzzed || buzzing;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-10 px-4 py-12">
      {/* Question bubble */}
      <div className="relative w-full rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Question
        </p>
        <p className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl">
          {question}
        </p>
        {/* Bubble tail */}
        <span
          aria-hidden
          className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
        />
      </div>

      {/* Buzz button */}
      <button
        type="button"
        onClick={handleBuzz}
        disabled={disabled}
        className="h-48 w-48 rounded-full bg-red-600 text-2xl font-extrabold tracking-wide text-white shadow-lg transition hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-600/40 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none disabled:active:scale-100 dark:disabled:bg-neutral-700"
      >
        {buzzing ? "…" : "BUZZ IN"}
      </button>

      {/* Status */}
      <div className="min-h-12 text-center" aria-live="polite">
        {someoneBuzzed ? (
          <p className="text-lg font-semibold">
            {iWon ? "You buzzed in first!" : `${winnerLabel} buzzed in first!`}
          </p>
        ) : authChecked && !userId ? (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            <Link href="/login" className="font-medium underline underline-offset-2">
              Sign in
            </Link>{" "}
            to buzz in.
          </p>
        ) : (
          <p className="text-sm text-neutral-500">Waiting for the first buzz…</p>
        )}

        {error && (
          <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
