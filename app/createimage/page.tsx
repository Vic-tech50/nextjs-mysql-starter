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
import { useActionState, useState } from "react";
import { create, FormState } from "../actions/crudimage";

const initialState: FormState = { success: false, message: "" };

export default function CreateForm() {
  const [state, formAction, isPending] = useActionState(create, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

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
                        defaultValue={state.errors?.name}
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
                        defaultValue={state.errors?.address}
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
                          defaultValue={state.errors?.dob}
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
                        defaultValue={state.errors?.comment}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="">Image</FieldLabel>
                      <Input
                        type="file"
                        id=""
                        placeholder=""
                        // defaultValue={state.errors?.image}
                        name="image"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageChange}
                      />
                      {state.errors?.image && (
                        <p className="text-red-500 text-sm">
                          {state.errors.image}
                        </p>
                      )}
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
