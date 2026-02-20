import prisma from "../../config/db";
import { sendAppointmentReminder } from "./notification.service";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Check for appointments that are exactly 24 hours away and send reminder emails
 */
export async function sendAppointmentReminders() {
  try {
    // Get tomorrow's date at 00:00 UTC
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    // Get the day after tomorrow at 00:00 UTC
    const dayAfter = new Date(tomorrow);
    dayAfter.setUTCDate(dayAfter.getUTCDate() + 1);

    // Find all appointments scheduled for tomorrow
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: tomorrow,
          lt: dayAfter,
        },
        status: { not: "CANCELLED" },
        // Only send reminders if we haven't already sent one
        reminderSent: false,
      },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        user: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
    });

    console.log(
      `📧 Found ${appointments.length} appointments for tomorrow. Sending reminders...`
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

        // Mark reminder as sent only if email was successful
        if (success) {
          await prisma.appointment.update({
            where: { id: apt.id },
            data: { reminderSent: true },
          });
        }
      } catch (error) {
        console.error(`Failed to send reminder for appointment ${apt.id}:`, error);
      }
    }

    console.log(
      `✅ Appointment reminder job completed at ${new Date().toISOString()}`
    );
  } catch (error) {
    console.error("❌ Error in appointment reminder job:", error);
  }
}
