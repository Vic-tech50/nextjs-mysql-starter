"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/jwt";
import { redirect } from "next/navigation";
// import { generateToken } from "@/lib/auth";
import { getClientIp } from "@/lib/ip";
import {
  checkLoginRateLimit,
  recordLoginAttempt,
  clearLoginAttempts,
} from "@/lib/rate-limit";
import { z } from "zod";
import { generateSecureToken } from "@/lib/tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";

export type LoginState = {
  success: boolean;
  message: string;
};

export interface AuthState {
  success: boolean;
  message?: string;
}

const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    name: z.string().min(1, "Name is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmpassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"], // attaches the error to this specific field
  });

export async function simpleregister(formData:FormData){
    console.log("REGISTER CALLED");

    const name=formData.get("name") as string;
    const email=formData.get("email") as string;
    const password=formData.get("password") as string;
    const confirmpassword=formData.get("confirmpassword") as string;

    if(!name || !email || !password){

        return{
            success:false,
            message:"All fields required"
        }

    }
    if(password == confirmpassword){
        return{
            success:false,
            message: "Password do not matched"
        }
    }

    const [rows]:any = await db.query( "SELECT * FROM users WHERE email=?", [email]);

    if(rows.length){

        return{
            success:false,
            message:"Email already exists"
        }

    }

    const hashed=await bcrypt.hash(password,10);

    await db.query(
    "INSERT INTO users(name,email,password) VALUES(?,?,?)", [name,email,hashed]
    );

    redirect('/login')

    // return{

    //     success:true,
    //     message:"Registration successful"

    // }

}

// app/actions/auth.ts




export async function register(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    confirmpassword: formData.get("confirmpassword"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  // ✅ no need for manual !name/!email/!password checks — Zod already guarantees this
  const { email, password, name } = parsed.data;

  const [existing]: any = await db.query("SELECT id FROM users WHERE email=?", [email]);
  if (existing.length > 0) {
    return { success: false, message: "Email already registered" };
  }

  const hashed = await bcrypt.hash(password, 10);
  const verificationToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  try {
    await db.query(
      `INSERT INTO users (email, password, name, role, email_verified, verification_token, verification_token_expires)
       VALUES (?, ?, ?, 'user', FALSE, ?, ?)`,
      [email, hashed, name, verificationToken, expiresAt]
    );

    await sendVerificationEmail(email, verificationToken);
  } catch (err: any) {
    console.error("Registration failed:", err.message);
    return { success: false, message: "Something went wrong. Please try again." };
  }

  return {
    success: true,
    message: "Check your email to verify your account before logging in.",
  };
}




export async function normallogin( prevState: LoginState,formData: FormData): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

    const [rows]:any=await db.query("SELECT * FROM users WHERE email=?",[email]);

    if(rows.length===0){

        return{
            success:false,
            message: "User do not exist"
        }

    }

    const user=rows[0];

    const match=await bcrypt.compare(password,user.password);

    if(!match){

        return{
            success:false,
            message: "Incorrect password.",
        }

    }

    const token=generateToken(user);

    (await cookies()).set("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:"lax",
        path:"/"
    });

    redirect("/dashboard")

    // return{
    //     success:true
    // }

}

export async function loginratelimiter(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {

  const email = (formData.get("email") as string).trim();
  const password = formData.get("password") as string;

  const ip = await getClientIp();

  // Check rate limit
  const rate = await checkLoginRateLimit(email, ip);

  if (rate.blocked) {
    return {
      success: false,
      message:
        "Too many login attempts. Please try again in 15 minutes.",
    };
  }

  const [rows]: any = await db.query(
    "SELECT * FROM users WHERE email=? LIMIT 1",
    [email]
  );

  if (rows.length === 0) {
    await recordLoginAttempt(email, ip);

    return {
      success: false,
      message: "User does not exist.",
    };
  }

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    await recordLoginAttempt(email, ip);

    return {
  success: false,
  message: `Incorrect password. ${rate.remaining - 1} attempt(s) remaining.`,
};

    // return {
    //   success: false,
    //   message: "Incorrect password.",
    // };
  }

   if (!user.email_verified) {
    return {
      success: false,
      message: "Please verify your email before logging in. Check your inbox.",
    };
  }

  // Successful login: clear failed attempts
  await clearLoginAttempts(email, ip);

  const token = generateToken(user);

  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  redirect("/dashboard");
}


export async function logout(){

(await cookies()).delete("token");
redirect("/login");

}

// export async function logout() {
//   (await cookies()).delete("token");
//   redirect("/login");
// }


// app/actions/auth.ts (add to same file)

export async function verifyEmail(token: string): Promise<AuthState> {
  if (!token) return { success: false, message: "Invalid verification link" };

  const [rows]: any = await db.query(
    "SELECT id, verification_token_expires FROM users WHERE verification_token=?",
    [token]
  );

  if (rows.length === 0) {
    return { success: false, message: "Invalid or expired verification link" };
  }

  const user = rows[0];

  if (new Date(user.verification_token_expires) < new Date()) {
    return { success: false, message: "Verification link has expired. Please request a new one." };
  }

  await db.query(
    `UPDATE users SET email_verified=TRUE, verification_token=NULL, verification_token_expires=NULL WHERE id=?`,
    [user.id]
  );

  return { success: true, message: "Email verified! You can now log in." };
}

export async function resendVerificationEmail(email: string): Promise<AuthState> {
  const [rows]: any = await db.query(
    "SELECT id, email_verified FROM users WHERE email=?",
    [email]
  );

  if (rows.length === 0) {
    // don't reveal whether the email exists — security best practice
    return { success: true, message: "If that email exists, a verification link has been sent." };
  }

  if (rows[0].email_verified) {
    return { success: false, message: "Email is already verified." };
  }

  const token = generateSecureToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await db.query(
    "UPDATE users SET verification_token=?, verification_token_expires=? WHERE id=?",
    [token, expiresAt, rows[0].id]
  );

  await sendVerificationEmail(email, token);

  return { success: true, message: "If that email exists, a verification link has been sent." };
}


// app/actions/auth.ts (add to same file)

export async function resendVerificationAction(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;

  if (!email) {
    return { success: false, message: "Email is required" };
  }

  return resendVerificationEmail(email); // reuses your existing function from earlier
}