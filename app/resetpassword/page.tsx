import AuthResetPassword from "@/components/ui/auth-reset-password";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) redirect("/forgot-password");

  return <AuthResetPassword token={token} />;
}
