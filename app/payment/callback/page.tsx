// app/payment/callback/page.tsx
import { verifyPaystackPayment } from "@/app/actions/paystack";
import { verifyFlutterwavePayment } from "@/app/actions/flutterwave";

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; transaction_id?: string; status?: string }>;
}) {
  const params = await searchParams;

  let result;

  if (params.reference) {
    // Paystack redirects with ?reference=
    result = await verifyPaystackPayment(params.reference);
  } else if (params.transaction_id) {
    // Flutterwave redirects with ?transaction_id= & ?status=
    result = await verifyFlutterwavePayment(params.transaction_id);
  }

  if (!result?.success) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
        <p>{result?.message ?? "We couldn't verify your payment."}</p>
      </div>
    );
  }

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful 🎉</h1>
      <p>Amount: {result.amount} {result.currency}</p>
      <p>Reference: {result.reference}</p>
    </div>
  );
}