// app/api/webhooks/paystack/route.ts
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const rawBody = await req.text(); // must read raw body for signature check

  const signature = req.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (hash !== signature) {
    console.warn("Invalid Paystack webhook signature");
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  switch (event.event) {
    case "charge.success": {
      const { reference, amount, currency, customer } = event.data;

      // ✅ TODO: mark order as paid in your DB
      // Idempotency: check if reference was already processed before updating
      console.log("Paystack payment success:", {
        reference,
        amount: amount / 100,
        currency,
        email: customer.email,
      });
      break;
    }

    case "charge.failed": {
      console.log("Paystack payment failed:", event.data.reference);
      // ✅ TODO: mark order as failed
      break;
    }

    default:
      console.log("Unhandled Paystack event:", event.event);
  }

  // Always respond 200 quickly so Paystack doesn't retry unnecessarily
  return NextResponse.json({ received: true }, { status: 200 });
}