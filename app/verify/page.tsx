// import AuthVerifyEmail from "@/components/ui/auth-verify-email";

// export default function Page() {
//   return <AuthVerifyEmail />;
// }

// app/resend-verification/page.tsx
// import ResendVerificationForm from "./ResendVerificationForm";

import AuthVerifyEmail from "@/components/ui/auth-verify-email";

export default async function ResendVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="max-w-sm mx-auto p-6 mt-20 text-center">
      <AuthVerifyEmail />
      {/* <h1 className="text-xl font-bold mb-2">Verify Your Email</h1>
      <p className="text-gray-500 text-sm mb-6">
        Your account isn't verified yet. We can send you a new verification
        link.
      </p> */}
      {/* <ResendVerificationForm defaultEmail={email || ""} /> */}
    </div>
  );
}
