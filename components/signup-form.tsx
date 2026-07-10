"use client";
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
import { register } from "@/app/actions/auth";

export function SignupForm(props: React.ComponentProps<typeof Card>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={register}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" name="name" type="text" placeholder="John Doe" />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
              />
              <FieldDescription>We'll never share your email.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
              />
              <FieldDescription>
                Must be at least 8 characters.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minLength={8}
              />
            </Field>

            <Button className="w-full" type="submit">
              Create Account
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
      </CardContent>
    </Card>
  );
}
