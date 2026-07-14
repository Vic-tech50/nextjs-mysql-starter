"use client";
import * as React from "react";
// import { useState, useTransition } from "react";
import { useState, useTransition } from "react";
import { initializePaystackPayment } from "@/app/actions/paystack"; // call paystack action
import { initializeFlutterwavePayment } from "@/app/actions/flutterwave"; // call flutterwave action
import { createCheckoutSession } from "@/app/actions/stripe";
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

import { useActionState } from "react"; //custom hook to manage form state and flash messages

//flash message state
const initialState = {
  success: false,
  message: "",
};

export default function Page() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(1000);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  //   const [state, formAction] = useActionState(sendMail, initialState); //custom hook to manage form state and flash messages

  const payWithPaystack = () => {
    startTransition(async () => {
      try {
        setError("");
        const { authorizationUrl } = await initializePaystackPayment({
          email,
          amount,
        });
        window.location.href = authorizationUrl; // redirect to Paystack checkout
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment failed");
      }
    });
  };

  const payWithFlutterwave = () => {
    startTransition(async () => {
      try {
        setError("");
        const { paymentLink } = await initializeFlutterwavePayment({
          email,
          amount,
          name: "Customer",
        });
        window.location.href = paymentLink; // redirect to Flutterwave checkout
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment failed");
      }
    });
  };

  const payWithStripe = () => {
    startTransition(async () => {
      try {
        setError("");
        const { checkoutUrl } = await createCheckoutSession({ email, amount });
        window.location.href = checkoutUrl; // redirect to Stripe Checkout
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment failed");
      }
    });
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
                <BreadcrumbPage>Payment</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="w-[70%] mx-auto">
            {/* //flash message */}
            {/* {state.message && (
              <div
                className={`rounded p-3 ${
                  state.success
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {state.message}
              </div>
            )} */}

            <FieldGroup>
              <FieldSet>
                <FieldLegend>Make Payment</FieldLegend>
                <FieldDescription>
                  Enter your details to make a payment
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="">Email</FieldLabel>
                    <Input
                      id=""
                      placeholder=""
                      name="name"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="">Amount</FieldLabel>
                    <Input
                      id=""
                      placeholder=""
                      name="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSeparator />
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Field orientation="horizontal">
                <Button
                  onClick={payWithPaystack}
                  disabled={isPending || !email}
                  className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
                >
                  {isPending ? "Processing..." : "Pay with Paystack"}
                </Button>{" "}
                <br />
                <br />
                <Button
                  onClick={payWithFlutterwave}
                  disabled={isPending || !email}
                  className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-50"
                >
                  {isPending ? "Processing..." : "Pay with Flutterwave"}
                </Button>{" "}
                <br />
                <br />
                <button
                  onClick={payWithStripe}
                  disabled={isPending || !email}
                  className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
                >
                  {isPending ? "Processing..." : "Pay with Stripe"}
                </button>
              </Field>
            </FieldGroup>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
