// lib/auth.ts
import jwt from "jsonwebtoken"; // jwt library for token generation and verification
import { cookies } from "next/headers"; // cookies utility from Next.js for handling cookies

// Define the structure of the token payload
interface TokenPayload {
  id: number;
  email: string;
  role: "user" | "admin";
}

// Function to generate a JWT token for a user
export function generateToken(user: { id: number; email: string; role: "user" | "admin" }) {
    // Generate a JWT token using the user's id, email, and role
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
}

// Function to verify a JWT token and return the payload if valid
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    return null;
  }
}

// Function to get the current session by reading the token from cookies and verifying it
export async function getSession(): Promise<TokenPayload | null> {
  const token = (await cookies()).get("token")?.value; // Get the token from cookies
  if (!token) return null; // If no token is found, return null indicating no session
  return verifyToken(token); // Verify the token and return the payload if valid, otherwise return null
}