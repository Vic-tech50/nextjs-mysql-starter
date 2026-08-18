// app/verify-email/page.tsx
import { Suspense } from "react";
import { verifyEmail } from "@/app/actions/auth";
import Link from "next/link";

async function VerifyResult({ token }: { token: string }) {
  const result = await verifyEmail(token);

  return (
    <div className="text-center">
      <h1 className={`text-xl font-bold ${result.success ? "text-green-600" : "text-red-600"}`}>
        {result.success ? "Email Verified ✅" : "Verification Failed"}
      </h1>
      <p className="text-gray-500 mt-2">{result.message}</p>
      <Link href="/login" className="text-indigo-600 mt-4 inline-block hover:underline">
        Go to Login
      </Link>
    </div>
  );
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex items-center justify-center min-h-screen">
      {token ? (
        <Suspense fallback={<p>Verifying...</p>}>
          <VerifyResult token={token} />
        </Suspense>
      ) : (
        <p className="text-red-500">No verification token provided.</p>
      )}
    </div>
  );
}