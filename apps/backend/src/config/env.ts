import { z } from "zod";
import { logger } from "../utils/logger";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  PORT: z.coerce.number().default(4000),
  TRUST_PROXY: z
    .enum(["0", "1", "false", "true"])
    .optional()
    .default("false")
    .transform((v) => v === "1" || v === "true"),
  MAIL_HOST: z.string().default("smtp.gmail.com"),
  MAIL_PORT: z.coerce.number().default(587),
  MAIL_USER: z.string().default(""),
  MAIL_PASS: z.string().default(""),
  FRONTEND_URL: z
    .string()
    .default("http://localhost:5173")
    .transform((val) => val.split(",").map((s) => s.trim())),
  RESEND_API_KEY: z.string().default(""),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  logger.error("❌ Invalid environment variables:");
  logger.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;
export type Env = z.infer<typeof envSchema>;
