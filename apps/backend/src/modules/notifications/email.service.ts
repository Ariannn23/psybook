import { Resend } from "resend";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

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
    const isProd = process.env.NODE_ENV === "production";
    if (!resend) {
      if (!isProd) {
        logger.info(` [EMAIL SIMULATION] To: ${to} | Subject: ${subject}`);
        logger.warn(
          "ℹ Configure RESEND_API_KEY in .env to enable real emails",
        );
      }
      return true;
    }

    if (!isProd) {
      logger.info(` Sending email via Resend to ${to} with subject: "${subject}"`);
    }

    const { data: _data, error } = await resend.emails.send({
      from: "PsyBook <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      logger.error("Resend API Error:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    logger.error("Failed to send email via Resend:", error);
    return false;
  }
}
