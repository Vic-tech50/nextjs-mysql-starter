import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { encrypt, decrypt } from "@/lib/encryption";

// app/page.tsx (Server Component)
import { headers } from "next/headers";
import { Suspense } from "react";

async function Head() {
  const headersList = await headers();

  const userAgent = headersList.get("user-agent");
  const authHeader = headersList.get("authorization");
  const ip = headersList.get("cookie");
  const content = headersList.get("referer");
  const allHeadersObject = Object.fromEntries(headersList.entries());
  const allHeadersArray = Array.from(headersList.entries());
  const data = encrypt("victor");
  const decryptdata = decrypt(
    "wS5ZiyNz+iT3Eimy3jkfcMpVhrLj6oGZCOvN5XhR1/mFtA==",
  );

  return (
    <>
      <p>Your browser: {userAgent}</p>
      <h2>Auth Heeader: {ip}</h2>
      <h2>Auth Content: {content}</h2>
      <h2>Encrypted: {data}</h2>
      <h2>Dencrypted: {decryptdata}</h2>

      <pre>{JSON.stringify(allHeadersObject, null, 2)}</pre>
    </>
  );
}

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<p>Loading ...</p>}>
            <Head />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
