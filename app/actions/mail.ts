"use server";

import { transporter } from "@/lib/mail";
import { contactTemplate } from "@/template/contact";

export async function sendMail(prevState: any, formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const message = formData.get("message")?.toString();

  if (!name || !email || !message) {
    return {
      success: false,
      message: "All fields are required.",
    };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_To,
      subject: "New Contact Form",
      html: contactTemplate(name, email, message),
    //   html: `
    //     <h2>New Contact Message</h2>

    //     <p><strong>Name:</strong> ${name}</p>

    //     <p><strong>Email:</strong> ${email}</p>

    //     <p>${message}</p>
    //   `,
    });

    return {
      success: true,
      message: "Email sent successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to send email.",
    };
  }
}