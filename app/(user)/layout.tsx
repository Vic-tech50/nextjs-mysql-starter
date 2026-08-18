// app/(user)/layout.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

async function AuthGuard({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) redirect("/login");
  if (session.role !== "user") redirect("/unauthorized");

  return <>{children}</>;
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="bg-indigo-600 text-white p-4 flex gap-4">
        <span>My App</span>
      </nav>
      <main className="p-6">
        <Suspense fallback={<div className="p-6">Checking session...</div>}>
          <AuthGuard>{children}</AuthGuard>
        </Suspense>
      </main>
    </div>
  );
}


// // app/dashboard/layout.tsx
// import { redirect } from "next/navigation";
// import { getSession } from "@/lib/auth";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await getSession();

//  if (!session) redirect("/login");
//   if (session.role !== "user") redirect("/unauthorized");
//   // dashboard is open to any logged-in role; remove this comment's assumption
//   // if you want it strictly user-only, add: if (session.role !== "user") redirect("/admin")

//   return <>{children}</>;
// }