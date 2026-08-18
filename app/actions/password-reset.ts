// app/actions/password-reset.ts
"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import  db  from "@/lib/db";
import { generateSecureToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { redirect } from "next/navigation";

export interface ResetState {
  success: boolean;
  message?: string;
}

const emailSchema = z.string().email();

export async function requestPasswordReset(
  prevState: ResetState,
  formData: FormData
): Promise<ResetState> {
  const email = formData.get("email") as string;

  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { success: false, message: "Please enter a valid email" };
  }

  const [rows]: any = await db.query("SELECT id FROM users WHERE email=?", [email]);

  // Always return the same message whether or not the email exists —
  // prevents attackers from discovering which emails are registered
  const genericMessage = "If that email exists, a password reset link has been sent.";

  if (rows.length === 0) {
    return { success: true, message: genericMessage };
  }

  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await db.query(
    "UPDATE users SET reset_token=?, reset_token_expires=? WHERE id=?",
    [token, expiresAt, rows[0].id]
  );

  await sendPasswordResetEmail(email, token);

  return { success: true, message: genericMessage };
}


// app/actions/password-reset.ts (add to same file)

const newPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function resetPassword(
  token: string,
  prevState: ResetState,
  formData: FormData
): Promise<ResetState> {
  const parsed = newPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const [rows]: any = await db.query(
    "SELECT id, reset_token_expires FROM users WHERE reset_token=?",
    [token]
  );

  if (rows.length === 0) {
    return { success: false, message: "Invalid or expired reset link" };
  }

  const user = rows[0];

  if (new Date(user.reset_token_expires) < new Date()) {
    return { success: false, message: "Reset link has expired. Please request a new one." };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);

  await db.query(
    "UPDATE users SET password=?, reset_token=NULL, reset_token_expires=NULL WHERE id=?",
    [hashed, user.id]
  );

  redirect("/login");
}