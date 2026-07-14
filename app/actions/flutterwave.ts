// app/actions/flutterwave.ts
"use server";

interface FlwInitResponse {
  status: "success" | "error";
  message: string;
  data: { link: string };
}

interface FlwVerifyResponse {
  status: "success" | "error";
  data: {
    status: "successful" | "failed";
    tx_ref: string;
    amount: number;
    currency: string;
    customer: { email: string };
  };
}

export async function initializeFlutterwavePayment(formData: {
  email: string;
  amount: number;
  name?: string;
}) {
  const { email, amount, name } = formData;
  const tx_ref = `tx-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref,
      amount,
      currency: "NGN",
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
      customer: { email, name },
      customizations: { title: "Order Payment" },
    }),
  });

  const data: FlwInitResponse = await response.json();

  if (data.status !== "success") {
    throw new Error(data.message || "Failed to initialize payment");
  }

  return { paymentLink: data.data.link, tx_ref };
}

export async function verifyFlutterwavePayment(transactionId: string) {
  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  const data: FlwVerifyResponse = await response.json();

  if (data.status !== "success" || data.data.status !== "successful") {
    return { success: false, message: "Payment verification failed" };
  }

  // ✅ TODO: update your DB / order status here

  return {
    success: true,
    amount: data.data.amount,
    currency: data.data.currency,
    email: data.data.customer.email,
    reference: data.data.tx_ref,
  };
}