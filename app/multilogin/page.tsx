// app/login/LoginForm.tsx
"use client";

import { useActionState } from "react";
import { login, LoginState } from "@/app/actions/multiauth";

const initialState: LoginState = { success: false };

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="max-w-sm mx-auto space-y-4 p-6">
      <input name="email" type="email" placeholder="Email" required className="w-full border rounded px-3 py-2" />
      <input name="password" type="password" placeholder="Password" required className="w-full border rounded px-3 py-2" />

      {state.message && <p className="text-red-500 text-sm">{state.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}