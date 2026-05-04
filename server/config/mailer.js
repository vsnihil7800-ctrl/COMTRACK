import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.log("Resend not configured. Email skipped.");
    return;
  }
  try {
    await resend.emails.send({
      from: "COMTRACK <onboarding@resend.dev>",
      to,
      subject,
      html
    });
    console.log("Email sent to", to);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }
}