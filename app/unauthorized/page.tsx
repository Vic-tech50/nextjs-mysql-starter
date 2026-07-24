// app/unauthorized/page.tsx
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { Suspense } from "react";

async function BackLink() {
  const session = await getSession();

  const href =
    session?.role === "admin"
      ? "/admin"
      : session?.role === "user"
      ? "/dashboard"
      : "/login"; // not logged in at all → send to login, not a guessed dashboard

  const label = session ? "Back to Dashboard" : "Go to Login";

  return (
    <Link href={href} className="text-indigo-600 mt-4 hover:underline">
      {label}
    </Link>
  );
}

export default async function UnauthorizedPage() {
  const session = await getSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold text-red-600">403 — Access Denied</h1>
      <p className="text-gray-500 mt-2">
        You don't have permission to view this page.
      </p>
    <Suspense fallback={<div className="mt-4 text-gray-400 text-sm">Loading...</div>}>
        <BackLink />
      </Suspense>
    </div>
  );
}
