"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

import { create } from "@/app/actions/crud";
import Link from "next/link";

const initialState = {
  success: false,
  message: "",
  errors: {},
  values: {
    name: "",
    address: "",
    dob: "",
    comment: "",
  },
};

export default function Create() {
  //   const [date, setDate] = React.useState<Date>();
  const [state, formAction, isPending] = React.useActionState(
    create,
    initialState,
  );
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
                <BreadcrumbPage>Create </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Link href="/modal">Modal</Link>
          <div className="w-[70%] mx-auto">
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
                  <FieldLegend>Create</FieldLegend>
                  <FieldDescription>
                    All transactions are secure and encrypted
                  </FieldDescription>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="">Name</FieldLabel>
                      <Input
                        id=""
                        placeholder=""
                        name="name"
                        defaultValue={state.values?.name}
                      />
                      {state.errors?.name && (
                        <p className="text-red-500 text-sm">
                          {state.errors.name}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="">Address</FieldLabel>
                      <Input
                        id=""
                        placeholder=""
                        name="address"
                        defaultValue={state.values?.address}
                      />
                      {state.errors?.address && (
                        <p className="text-red-500 text-sm">
                          {state.errors.address}
                        </p>
                      )}
                      <FieldDescription>
                        Enter your 16-digit card number
                      </FieldDescription>
                    </Field>
                    <div className="">
                      <Field>
                        <FieldLabel htmlFor="">Date</FieldLabel>
                        <Input
                          type="date"
                          id=""
                          placeholder=""
                          defaultValue={state.values?.dob}
                          name="dob"
                        />
                        {state.errors?.dob && (
                          <p className="text-red-500 text-sm">
                            {state.errors.dob}
                          </p>
                        )}
                        <FieldDescription>
                          Enter your 16-digit card number
                        </FieldDescription>
                      </Field>
                    </div>
                  </FieldGroup>
                </FieldSet>
                <FieldSeparator />

                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="">Comments</FieldLabel>
                      <Textarea
                        id=""
                        placeholder="Add any additional comments"
                        className="resize-none"
                        name="comment"
                        defaultValue={state.values?.comment}
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>
                <Field orientation="horizontal">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="disabled:opacity-50"
                  >
                    {isPending ? "Submitting..." : "Submit"}
                  </Button>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </div>

          {/* {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="aspect-video h-12 w-full rounded-lg bg-muted/50"
            />
          ))} */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
