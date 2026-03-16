import type { Patient } from "./patients";
import type { User } from "./auth";
import type { Service } from "./services";

export const AppointmentStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export interface Appointment {
  id: string;
  patientId: string;
  userId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  patient?: Patient;
  user?: User;
  service?: Service;
}

export interface CreateAppointmentInput {
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceId?: string;
  reason?: string;
  notes?: string;
}

export interface UpdateAppointmentInput {
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: AppointmentStatus;
  reason?: string;
  notes?: string;
}
