// app/api/webhooks/flutterwave/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH!; // set this in dashboard + .env
  const signature = req.headers.get("verif-hash");

  if (!signature || signature !== secretHash) {
    console.warn("Invalid Flutterwave webhook signature");
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const event = await req.json();

  switch (event.event) {
    case "charge.completed": {
      const { status, tx_ref, amount, currency, customer, id } = event.data;

      if (status === "successful") {
        // ⚠️ Flutterwave recommends re-verifying via API before trusting webhook data
        const verifyRes = await fetch(
          `https://api.flutterwave.com/v3/transactions/${id}/verify`,
          {
            headers: {
              Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            },
          }
        );
        const verifyData = await verifyRes.json();

        if (
          verifyData.data.status === "successful" &&
          verifyData.data.amount === amount &&
          verifyData.data.currency === currency
        ) {
          // ✅ TODO: mark order as paid in your DB
          // Idempotency: check if tx_ref was already processed before updating
          console.log("Flutterwave payment verified & success:", {
            tx_ref,
            amount,
            currency,
            email: customer.email,
          });
        } else {
          console.warn("Flutterwave verification mismatch:", tx_ref);
        }
      } else {
        console.log("Flutterwave payment not successful:", tx_ref);
        // ✅ TODO: mark order as failed
      }
      break;
    }

    default:
      console.log("Unhandled Flutterwave event:", event.event);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}