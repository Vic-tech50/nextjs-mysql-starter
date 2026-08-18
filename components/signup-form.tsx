"use client";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { register, AuthState } from "@/app/actions/auth";

const initialState: AuthState = { success: false };

export function SignupForm(props: React.ComponentProps<typeof Card>) {
  const [state, formAction, isPending] = useActionState(register, initialState);

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.message && (
          <p
            className={`text-sm mb-3 ${state.success ? "text-green-600" : "text-red-500"}`}
          >
            {state.message}
          </p>
        )}

        {/* Optional: hide the form entirely once registration succeeds, since there's nothing left to do here */}
        {!state.success && (
          <form action={formAction}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                />
                <FieldDescription>
                  We'll never share your email.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  required
                />
                <FieldDescription>
                  Must be at least 8 characters.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmpassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmpassword"
                  name="confirmpassword"
                  type="password"
                  minLength={8}
                  required
                />
              </Field>

              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Creating Account ..." : "Create Account"}
              </Button>

              <Button variant="outline" type="button" className="w-full">
                Sign up with Google
              </Button>

              <FieldDescription className="text-center mt-2">
                Already have an account?{" "}
                <Link href="/login" className="font-medium underline">
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
