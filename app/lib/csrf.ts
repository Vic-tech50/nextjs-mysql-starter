// lib/csrf.ts
"use server"
import "server-only"; //npm install server-only
import crypto from "crypto";
import { cookies } from "next/headers";

const CSRF_COOKIE = "csrf_token";

export async function generateCsrfToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");

  (await cookies()).set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return token;
}

export async function verifyCsrfToken(submittedToken: string): Promise<boolean> {
  const cookieToken = (await cookies()).get(CSRF_COOKIE)?.value;
  if (!cookieToken || !submittedToken) return false;

  // timing-safe comparison — prevents timing attacks from guessing the token
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(submittedToken)
  );
}