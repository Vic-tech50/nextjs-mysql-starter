// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.warn("Invalid Stripe webhook signature:", err);
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // ✅ TODO: mark order as paid in your DB
      // Idempotency: check if session.id was already processed
      console.log("Stripe checkout completed:", {
        sessionId: session.id,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency,
        email: session.customer_email,
      });
      break;
    }

    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log("PaymentIntent succeeded:", intent.id);
      // ✅ TODO: mark order as paid (useful if using Elements flow instead of Checkout)
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log("PaymentIntent failed:", intent.id);
      // ✅ TODO: mark order as failed
      break;
    }

    default:
      console.log("Unhandled Stripe event:", event.type);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}