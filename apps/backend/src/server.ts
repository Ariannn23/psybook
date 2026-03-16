import app from "./app";
import { env } from "./config/env";
import cron from "node-cron";
import { sendAppointmentReminders } from "./modules/notifications/appointment-scheduler";
import { logger } from "./utils/logger";

cron.schedule("0 * * * *", () => {
  sendAppointmentReminders();
});

app.listen(env.PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    logger.info(`🚀 PsyBook Backend running on port ${env.PORT}`);
    logger.info(`📚 Swagger docs: http://localhost:${env.PORT}/api/docs`);
  }
});
