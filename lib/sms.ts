import client from "./twilio";

export async function sendSMS(
  to: string, // The recipient's phone number
  message: string // The message content
) {
  try {
    const sms = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to,
    });

    return {
      success: true,
      sid: sms.sid,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to send SMS.",
    };
  }
}