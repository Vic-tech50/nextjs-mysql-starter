"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

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

import { useActionState } from "react"; //custom hook to manage form state and flash messages
import { sendOtp } from "../actions/sms";

//flash message state
const initialState = {
  success: false,
  message: "",
};

export default function smsOtp() {
  const [state, formAction] = useActionState(sendOtp, initialState); //custom hook to manage form state and flash messages

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
                <BreadcrumbPage>SMS </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="w-[70%] mx-auto">
            {/* //flash message */}
            {state.message && (
              <div
                className={`rounded p-3 ${
                  state.success
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {state.message}
              </div>
            )}

            <form action={formAction}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend>SMS</FieldLegend>
                  <FieldDescription>Send SMS</FieldDescription>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="">Phone</FieldLabel>
                      <Input id="" placeholder="+2348012345678" name="phone" />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator />

               
                <Field orientation="horizontal">
                  <Button type="submit">Submit</Button>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
