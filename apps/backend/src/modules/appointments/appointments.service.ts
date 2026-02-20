import prisma from "../../config/db";
import { createError } from "../../middlewares/error.middleware";
import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointments.schema";
import {
  sendAppointmentConfirmation,
  sendAppointmentCancellation,
} from "../notifications/notification.service";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const appointmentInclude = {
  patient: { select: { id: true, name: true, email: true, phone: true } },
  user: { select: { id: true, name: true, email: true } },
  service: { select: { id: true, name: true, duration: true, price: true } },
};

// Helper function to convert YYYY-MM-DD string to Date at midnight UTC
function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  // Create a date at midnight UTC for the given year, month, day
  return new Date(Date.UTC(year, month - 1, day));
}

export async function createAppointment(data: CreateAppointmentInput) {
  const appointmentDate = parseDateString(data.date);
  
  // Check for scheduling conflict
  const conflict = await prisma.appointment.findFirst({
    where: {
      userId: data.userId,
      date: appointmentDate,
      startTime: data.startTime,
      status: { not: "CANCELLED" },
    },
  });
  if (conflict) throw createError("Este horario ya está reservado", 409);

  const appointment = await prisma.appointment.create({
    data: {
      ...data,
      date: appointmentDate,
    },
    include: appointmentInclude,
  });

  // Send confirmation email (non-blocking)
  try {
    const formattedDate = format(appointment.date, "PPP", { locale: es });
    await sendAppointmentConfirmation({
      patientEmail: appointment.patient.email,
      patientName: appointment.patient.name,
      serviceName: appointment.service.name,
      date: formattedDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      doctorName: appointment.user.name,
      notes: appointment.notes || undefined,
    });
  } catch (error) {
    console.error("Failed to send appointment confirmation email:", error);
    // Don't throw error - let appointment creation succeed even if email fails
  }

  return appointment;
}

export async function getAllAppointments(filters?: {
  userId?: string;
  date?: string;
  status?: string;
}) {
  return prisma.appointment.findMany({
    where: {
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.date && { date: parseDateString(filters.date) }),
      ...(filters?.status && { status: filters.status as any }),
    },
    include: appointmentInclude,
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}

export async function getAppointmentById(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: appointmentInclude,
  });
  if (!appointment) throw createError("Appointment not found", 404);
  return appointment;
}

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentInput,
) {
  const exists = await prisma.appointment.findUnique({ where: { id } });
  if (!exists) throw createError("Appointment not found", 404);

  return prisma.appointment.update({
    where: { id },
    data: {
      ...data,
      ...(data.date && { date: parseDateString(data.date) }),
    },
    include: appointmentInclude,
  });
}

export async function deleteAppointment(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: appointmentInclude,
  });
  if (!appointment) throw createError("Appointment not found", 404);

  // Mark as cancelled instead of deleting
  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: appointmentInclude,
  });

  // Send cancellation email (non-blocking)
  try {
    const formattedDate = format(updated.date, "PPP", { locale: es });
    await sendAppointmentCancellation({
      patientEmail: updated.patient.email,
      patientName: updated.patient.name,
      serviceName: updated.service.name,
      date: formattedDate,
      startTime: updated.startTime,
      endTime: updated.endTime,
      doctorName: updated.user.name,
    });
  } catch (error) {
    console.error("Failed to send appointment cancellation email:", error);
  }

  return updated;
}
