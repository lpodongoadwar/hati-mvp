import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_NAME, cookieIsValid } from "./access";
import { unlockBuzz } from "./actions";
import { BuzzClient } from "./buzz-client";

export const metadata: Metadata = {
  title: "Buzz In",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Change this to the current question. */
const QUESTION = "Get ready… the next question is coming up!";

export default async function BuzzPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const cookieStore = await cookies();
  const authorized = cookieIsValid(cookieStore.get(COOKIE_NAME)?.value);

  if (authorized) {
    return <BuzzClient question={QUESTION} />;
  }

  const notConfigured = !process.env.BUZZ_PASSCODE;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Enter passcode</h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        This page is private. Ask the host for the passcode.
      </p>

      <form action={unlockBuzz} className="mt-6 space-y-4">
        <div>
          <label htmlFor="passcode" className="block text-sm font-medium">
            Passcode
          </label>
          <input
            id="passcode"
            name="passcode"
            type="password"
            required
            autoComplete="off"
            autoFocus
            className="mt-1.5 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-400">
            Incorrect passcode. Try again.
          </p>
        )}
        {notConfigured && (
          <p role="alert" className="text-sm text-red-700 dark:text-red-400">
            BUZZ_PASSCODE isn’t set on the server, so nobody can get in yet.
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
