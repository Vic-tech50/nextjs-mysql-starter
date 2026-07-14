"use server";

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    customer: { email: string };
  };
}

export async function initializePaystackPayment(formData: {
  email: string;
  amount: number; // in Naira
}) {
  const { email, amount } = formData;

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Paystack expects kobo
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback`,
    }),
  });

  const data: PaystackInitResponse = await response.json();

  if (!data.status) {
    throw new Error(data.message || "Failed to initialize payment");
  }

  return {
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
  };
}

export async function verifyPaystackPayment(reference: string) {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  const data: PaystackVerifyResponse = await response.json();

  if (!data.status || data.data.status !== "success") {
    return { success: false, message: data.message };
  }

  // ✅ TODO: update your DB / order status here

  return {
    success: true,
    amount: data.data.amount / 100,
    currency: data.data.currency,
    email: data.data.customer.email,
    reference: data.data.reference,
  };
}