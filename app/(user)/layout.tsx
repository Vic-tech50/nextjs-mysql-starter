// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

 if (!session) redirect("/login");
  if (session.role !== "user") redirect("/unauthorized");
  // dashboard is open to any logged-in role; remove this comment's assumption
  // if you want it strictly user-only, add: if (session.role !== "user") redirect("/admin")

  return <>{children}</>;
}