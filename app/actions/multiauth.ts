// app/actions/auth.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import db  from "@/lib/db";
import { generateToken } from "@/lib/auth";

export interface LoginState {
  success: boolean;
  message?: string;
}

export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
    // get data from formData
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  const [rows]: any = await db.query("SELECT * FROM users WHERE email=?", [email]); // check database for user with the provided email

  if (rows.length === 0) {
    return { success: false, message: "User does not exist." };
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password); // 

  if (!match) {
    return { success: false, message: "Incorrect password." };
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role }); // token generation with user role

  // Set the token in cookies with appropriate options
  (await cookies()).set("token", token, {
    httpOnly: true, // Ensures the cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
    sameSite: "lax", // Helps protect against CSRF attacks
    path: "/", // The cookie is accessible on all paths of the domain
    maxAge: 60 * 60 * 24, // Cookie expires in 1 day
  });

  // redirect() throws internally — must be OUTSIDE try/catch, and this is fine here
  // since there's no catch block wrapping it
  redirect(user.role === "admin" ? "/admin" : "/dashboard"); // Redirects the user based on their role after successful login
}

export async function logout() {
  (await cookies()).delete("token");
  redirect("/login");
}