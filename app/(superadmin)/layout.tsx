// app/(admin)/layout.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

async function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/unauthorized");

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav className="bg-gray-900 text-white p-4">Admin Panel</nav>
      <main className="p-6">
        <Suspense fallback={<div className="p-6">Checking session...</div>}>
          <AdminAuthGuard>{children}</AdminAuthGuard>
        </Suspense>
      </main>
    </div>
  );
}

// // app/admin/layout.tsx
// import { redirect } from "next/navigation";
// import { getSession } from "@/lib/auth";

// export default async function AdminLayout({
//   children,
// }: {
// children: React.ReactNode;
// }) {
//   const session = await getSession();

//   if (!session) redirect("/login");
//   if (session.role !== "admin") redirect("/unauthorized");

//   return (
//     <div>
//       <nav className="bg-gray-900 text-white p-4">Admin Panel — {session.email}</nav>
//       {children}
//     </div>
//   );
// }
