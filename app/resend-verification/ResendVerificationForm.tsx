// app/resend-verification/ResendVerificationForm.tsx
"use client";

import { useActionState } from "react";
import { resendVerificationAction, AuthState } from "@/app/actions/auth";
import Link from "next/link";

const initialState: AuthState = { success: false };

export default function ResendVerificationForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, formAction, isPending] = useActionState(resendVerificationAction, initialState);

  return (
    <div>
      {!state.success ? (
        <form action={formAction} className="space-y-4">
          <input
            name="email"
            type="email"
            defaultValue={defaultEmail}
            placeholder="Your email"
            required
            className="w-full border rounded px-3 py-2"
          />

          {state.message && !state.success && (
            <p className="text-red-500 text-sm">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Resend Verification Link"}
          </button>
        </form>
      ) : (
        <p className="text-green-600 text-sm">{state.message}</p>
      )}

      <p className="text-sm text-gray-500 mt-4">
        <Link href="/login" className="text-indigo-600 hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}