import { createHash, timingSafeEqual } from "crypto";

export const COOKIE_NAME = "buzz_access";

const hash = (value: string) => createHash("sha256").update(value).digest();

/** True when the typed passcode matches BUZZ_PASSCODE (constant-time compare). */
export function passcodeMatches(input: string): boolean {
  const expected = process.env.BUZZ_PASSCODE;
  if (!expected) return false;
  return timingSafeEqual(hash(input), hash(expected));
}

/** Value stored in the httpOnly cookie after a correct passcode. */
export function accessToken(): string {
  return hash(process.env.BUZZ_PASSCODE ?? "").toString("hex");
}

/** True when the cookie value matches the current passcode. */
export function cookieIsValid(value: string | undefined): boolean {
  const expected = process.env.BUZZ_PASSCODE;
  if (!expected || !value) return false;
  const a = Buffer.from(value, "hex");
  const b = hash(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
