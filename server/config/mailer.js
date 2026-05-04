import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
});

export async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_HOST) {
    return { preview: "SMTP not configured. Email skipped in dev.", to, subject };
  }
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || "COMTRACK <noreply@comtrack.app>",
    to,
    subject,
    html
  });
}