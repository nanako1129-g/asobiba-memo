import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "asobiba_admin";

function signedCookieValue(): string | null {
  const secret = process.env.ADMIN_PASSWORD?.trim();
  if (!secret) return null;
  return createHmac("sha256", secret).update("asobiba-admin-v1").digest("hex");
}

export async function verifyAdminSession(): Promise<boolean> {
  const expected = signedCookieValue();
  if (!expected) return false;
  const got = (await cookies()).get(COOKIE_NAME)?.value;
  if (!got) return false;
  try {
    const a = Buffer.from(got, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** パスワードが環境変数と一致したときだけ Cookie を付与する */
export async function setAdminSessionFromPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  if (password !== expected) return false;
  const value = signedCookieValue();
  if (!value) return false;
  (await cookies()).set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return true;
}

export async function clearAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}
