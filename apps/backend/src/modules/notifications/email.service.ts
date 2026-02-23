import nodemailer from "nodemailer";
import { env } from "../../config/env";

// Log email configuration on startup
console.log("📧 Email Configuration:", {
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  user: env.MAIL_USER ? `${env.MAIL_USER.substring(0, 3)}***` : "NOT SET",
  pass: env.MAIL_PASS ? "SET" : "NOT SET",
});

// Create transporter
const isGmail = env.MAIL_HOST.includes("gmail.com");

const transporter = nodemailer.createTransport({
  ...(isGmail
    ? { service: "gmail" }
    : { host: env.MAIL_HOST, port: env.MAIL_PORT }),
  secure: isGmail ? true : env.MAIL_PORT === 465,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

// Verify connection
transporter
  .verify()
  .then(() => {
    console.log("✅ Email service ready - SMTP connection successful");
  })
  .catch((error) => {
    console.error("❌ Email service ERROR:", error.message);
    console.error(
      "ℹ️ Configure MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS in .env",
    );
  });

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<boolean> {
  try {
    // Check if email is configured
    if (!env.MAIL_USER || !env.MAIL_PASS) {
      console.warn(
        "⚠️ Email credentials not configured. Skipping send to:",
        to,
      );
      console.warn(
        "ℹ️ Configure MAIL_USER and MAIL_PASS in .env to enable emails",
      );
      return false;
    }

    console.log(`📤 Sending email to ${to} with subject: "${subject}"`);

    const result = await transporter.sendMail({
      from: env.MAIL_USER,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to ${to}`);
    console.log(`   Response ID: ${result.response}`);

    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return false;
  }
}
