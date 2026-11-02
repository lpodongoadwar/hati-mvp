"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, accessToken, passcodeMatches } from "./access";

export async function unlockBuzz(formData: FormData) {
  const input = String(formData.get("passcode") ?? "");

  if (!passcodeMatches(input)) {
    redirect("/buzz?error=1");
  }

  (await cookies()).set(COOKIE_NAME, accessToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/buzz",
    maxAge: 60 * 60 * 12, // 12 hours
  });

  redirect("/buzz");
}
