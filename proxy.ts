// middleware.ts (project root)
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // npm install jose | for JWT verification in Edge Runtime

// Define the structure of the token payload
interface TokenPayload {
  id: number;
  email: string;
  role: "user" | "admin";
}

// Edge Runtime does not support the 'jsonwebtoken' library, so we use 'jose' for JWT verification
async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!); // Encode the secret key for use with jose
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

// Define route access rules
const userRoutes = ["/dashboard", "/settings", "/profile", "/pushNotification"];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/register"];

// Middleware function to handle route access based on authentication and authorization
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl; // Get the pathname of the incoming request 
  const token = req.cookies.get("token")?.value; // Get the JWT token from cookiesy

  const session = token ? await verifyTokenEdge(token) : null; // Verify the token and get the session payload if valid, otherwise set session to null

  // Determine if the requested route is a user, admin, or auth route
  const isUserRoute = userRoutes.some((r) => pathname.startsWith(r));
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));

  // Not logged in at all → block protected routes
  if ((isUserRoute || isAdminRoute) && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in, but not an admin → block admin routes
  if (isAdminRoute && session && session.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Logged in → keep users away from login/register
  if (isAuthRoute && session) {
    return NextResponse.redirect(
      new URL(session.role === "admin" ? "/admin" : "/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

// Export the configuration for the middleware, specifying which routes it should apply to
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/pushNotification/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};