import app from "./app";
import { env } from "./config/env";
import cron from "node-cron";
import { sendAppointmentReminders } from "./modules/notifications/appointment-scheduler";

// Start the appointment reminder job (runs every hour at minute 0)
cron.schedule("0 * * * *", () => {
  console.log("⏰ Running appointment reminder job...");
  sendAppointmentReminders();
});

// Optional: Run once on startup (commented out to avoid immediate run)
// Uncomment if you want to check for reminders on server start
// sendAppointmentReminders();

app.listen(env.PORT, () => {
  console.log(`🚀 PsyBook Backend running on port ${env.PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${env.PORT}/api/docs`);
  console.log(`⏰ Appointment reminder job scheduled (runs every hour)`);
});
