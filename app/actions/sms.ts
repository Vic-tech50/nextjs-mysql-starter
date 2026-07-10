"use server";

import { sendSMS } from "@/lib/sms";

export async function sendOtp(
  prevState: any,
  formData: FormData
) {
  const phone = formData.get("phone")?.toString(); // Get the phone number from the form data


  // Validate the phone number
  if (!phone) {
    return {
      success: false,
      message: "Phone number is required.",
    };
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const result = await sendSMS(
    phone,
    `Your verification code is ${otp}`
  );

  if (!result.success) {
    return result;
  }

  // Save OTP in your database or cache with an expiry here

  return {
    success: true,
    message: "OTP sent successfully.",
  };
}