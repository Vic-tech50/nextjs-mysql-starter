// components/SendTestNotification.tsx
"use client";

import { useTransition } from "react";
import { sendNotificationToAll } from "@/app/actions/push";

export function SendTestNotification() {
  const [isPending, startTransition] = useTransition();

  const send = () => {
    startTransition(async () => {
      await sendNotificationToAll({
        title: "New message 🎉",
        body: "You've got something new to check out.",
        url: "/dashboard",
      });
    });
  };

  return (
    <button
      onClick={send}
      disabled={isPending}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      {isPending ? "Sending..." : "Send Test Notification"}
    </button>
  );
}

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
import LogoutButton from "@/components/logoutButton";

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
                <BreadcrumbPage>Push Notification</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <SendTestNotification />

          <LogoutButton />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}





