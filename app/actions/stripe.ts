// app/actions/stripe.ts
"use server";

import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(formData: {
  email: string;
  amount: number; // in Naira/Dollars (major unit)
  currency?: string;
}) {
  const { email, amount, currency = "usd" } = formData;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: "Order Payment" },
          unit_amount: Math.round(amount * 100), // Stripe expects cents/kobo
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return { checkoutUrl: session.url, sessionId: session.id };
}

export async function verifyStripeSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });

  if (session.payment_status !== "paid") {
    return { success: false, message: "Payment not completed" };
  }

  // ✅ TODO: update your DB / order status here

  return {
    success: true,
    amount: (session.amount_total ?? 0) / 100,
    currency: session.currency,
    email: session.customer_email,
    reference: session.id,
  };
}

// app/actions/stripe.ts (add to same file)

export async function createPaymentIntent(formData: {
  amount: number;
  currency?: string;
  email: string;
}) {
  const { amount, currency = "usd", email } = formData;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    receipt_email: email,
    automatic_payment_methods: { enabled: true },
  });

  return { clientSecret: paymentIntent.client_secret };
}