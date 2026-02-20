import { sendEmail } from "./email.service";
import {
  appointmentConfirmationEmailTemplate,
  appointmentReminderEmailTemplate,
  appointmentCancellationEmailTemplate,
} from "./email-templates";

export interface AppointmentNotificationData {
  patientEmail: string;
  patientName: string;
  serviceName: string;
  date: string; // Format: YYYY-MM-DD or formatted date
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  doctorName?: string;
  notes?: string;
}

export async function sendAppointmentConfirmation(
  data: AppointmentNotificationData
): Promise<boolean> {
  const html = appointmentConfirmationEmailTemplate({
    patientName: data.patientName,
    serviceName: data.serviceName,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    doctorName: data.doctorName,
    notes: data.notes,
  });

  return sendEmail({
    to: data.patientEmail,
    subject: "Confirmación de Cita - PsyBook",
    html,
  });
}

export async function sendAppointmentReminder(
  data: AppointmentNotificationData
): Promise<boolean> {
  const html = appointmentReminderEmailTemplate({
    patientName: data.patientName,
    serviceName: data.serviceName,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    doctorName: data.doctorName,
  });

  return sendEmail({
    to: data.patientEmail,
    subject: "Recordatorio de Cita - PsyBook",
    html,
  });
}

export async function sendAppointmentCancellation(
  data: AppointmentNotificationData
): Promise<boolean> {
  const html = appointmentCancellationEmailTemplate({
    patientName: data.patientName,
    serviceName: data.serviceName,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    doctorName: data.doctorName,
  });

  return sendEmail({
    to: data.patientEmail,
    subject: "Cita Cancelada - PsyBook",
    html,
  });
}
