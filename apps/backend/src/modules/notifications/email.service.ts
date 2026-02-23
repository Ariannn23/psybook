import { Resend } from "resend";
import { env } from "../../config/env";

// Initialize Resend
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

// Log email configuration on startup
console.log("📧 Email Configuration:", {
  provider: resend ? "Resend API" : "NONE (Fallback to log)",
  resendKey: env.RESEND_API_KEY
    ? `${env.RESEND_API_KEY.substring(0, 10)}***`
    : "NOT SET",
});

if (!resend) {
  console.warn(
    "⚠️ RESEND_API_KEY not set. Emails will only be logged to console.",
  );
} else {
  console.log("✅ Email service ready - Resend API initialized");
}

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
    if (!resend) {
      console.log(`📝 [EMAIL SIMULATION] To: ${to} | Subject: ${subject}`);
      console.warn("ℹ️ Configure RESEND_API_KEY in .env to enable real emails");
      return true; // Return true as simulation succeeded
    }

    console.log(
      `📤 Sending email via Resend to ${to} with subject: "${subject}"`,
    );

    const { data, error } = await resend.emails.send({
      from: "PsyBook <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error(
        "❌ Resend API Error Details:",
        JSON.stringify(error, null, 2),
      );
      return false;
    }

    console.log(`✅ Email sent successfully to ${to}`);
    console.log(`   Email ID: ${data?.id}`);

    return true;
  } catch (error) {
    console.error("❌ Failed to send email via Resend:", error);
    return false;
  }
}
