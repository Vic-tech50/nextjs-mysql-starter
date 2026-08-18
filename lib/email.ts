// lib/email.ts
import "server-only";
import { transporter } from "@/lib/mail";
import { forgetTemplate } from "@/template/forget";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: "noreply@yourapp.com",
    to: email,
    subject: "Verify your email",
    html: `
      <p>Welcome! Please verify your email address by clicking the link below:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link expires in 1 hour.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/resetpassword?token=${token}`;

  await transporter.sendMail({
    from: "noreply@yourapp.com",
    to: email,
    subject: "Reset your password",
    html: forgetTemplate(resetUrl)
  });
}