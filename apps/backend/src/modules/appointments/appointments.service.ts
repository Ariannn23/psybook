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
import { logger } from "../../utils/logger";
import { AppointmentStatus } from "@prisma/client";

const appointmentInclude = {
  patient: { select: { id: true, name: true, email: true, phone: true } },
  user: { select: { id: true, name: true, email: true } },
  service: { select: { id: true, name: true, duration: true, price: true } },
};

function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export async function createAppointment(data: CreateAppointmentInput) {
  const appointmentDate = parseDateString(data.date);

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

  sendAppointmentConfirmation({
    patientEmail: appointment.patient.email,
    patientName: appointment.patient.name,
    serviceName: appointment.service.name,
    date: format(appointment.date, "PPP", { locale: es }),
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    doctorName: appointment.user.name,
    notes: appointment.notes || undefined,
  }).catch((error) => {
    logger.error("Failed to send appointment confirmation email:", error);
  });

  return appointment;
}

export async function getAllAppointments(filters?: {
  userId?: string;
  date?: string;
  status?: AppointmentStatus;
}) {
  return prisma.appointment.findMany({
    where: {
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.date && { date: parseDateString(filters.date) }),
      ...(filters?.status && { status: filters.status }),
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

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: appointmentInclude,
  });

  sendAppointmentCancellation({
    patientEmail: updated.patient.email,
    patientName: updated.patient.name,
    serviceName: updated.service.name,
    date: format(updated.date, "PPP", { locale: es }),
    startTime: updated.startTime,
    endTime: updated.endTime,
    doctorName: updated.user.name,
  }).catch((error) => {
    logger.error("Failed to send appointment cancellation email:", error);
  });

  return updated;
}
