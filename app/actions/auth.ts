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

export type LoginState = {
  success: boolean;
  message: string;
};

export async function register(formData:FormData){
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