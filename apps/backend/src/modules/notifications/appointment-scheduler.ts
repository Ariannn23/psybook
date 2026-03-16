import prisma from "../../config/db";
import { sendAppointmentReminder } from "./notification.service";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { logger } from "../../utils/logger";

export async function sendAppointmentReminders() {
  try {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setUTCDate(dayAfter.getUTCDate() + 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: tomorrow,
          lt: dayAfter,
        },
        status: { not: "CANCELLED" },
        reminderSent: false,
      },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        user: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
    });

    logger.info(
      `📧 Found ${appointments.length} appointments for tomorrow. Sending reminders...`,
    );

    for (const apt of appointments) {
      try {
        const formattedDate = format(apt.date, "PPP", { locale: es });
        const success = await sendAppointmentReminder({
          patientEmail: apt.patient.email,
          patientName: apt.patient.name,
          serviceName: apt.service.name,
          date: formattedDate,
          startTime: apt.startTime,
          endTime: apt.endTime,
          doctorName: apt.user.name,
        });

        if (success) {
          await prisma.appointment.update({
            where: { id: apt.id },
            data: { reminderSent: true },
          });
        }
      } catch (error) {
        logger.error(`Failed to send reminder for appointment ${apt.id}:`, error);
      }
    }

    logger.info(
      `✅ Appointment reminder job completed at ${new Date().toISOString()}`,
    );
  } catch (error) {
    logger.error("❌ Error in appointment reminder job:", error);
  }
}
