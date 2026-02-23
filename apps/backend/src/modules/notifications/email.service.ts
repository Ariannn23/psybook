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
// Render often blocks port 587. Port 465 (SMTPS) is sometimes more successful.
const isGmail = env.MAIL_HOST.includes("gmail.com");

console.log(
  `📡 Preparing email transporter for ${isGmail ? "Gmail" : env.MAIL_HOST}...`,
);
console.log(
  `ℹ️ Using Port: ${env.MAIL_PORT}, Secure: ${env.MAIL_PORT === 465}`,
);

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_PORT === 465, // true for 465, false for 587
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },
  // Debugging logs
  debug: true,
  logger: true,
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email service ERROR details:", {
      message: error.message,
      code: (error as any).code,
      command: (error as any).command,
      stack: error.stack,
    });
    console.error(
      "ℹ️ Connection Timeout often means the port is blocked by Render. Try switching between 465 and 587 in environment variables.",
    );
  } else {
    console.log("✅ Email service ready - SMTP connection successful");
  }
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
