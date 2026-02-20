import type { Patient } from "./patients";
import type { User } from "./auth";
import type { Service } from "./services";

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface Appointment {
  id: string;
  patientId: string;
  userId: string;
  serviceId: string;
  date: string; // ISO Date
  startTime: string; // "10:00"
  endTime: string; // "11:00"
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Relations (might be included in some responses)
  patient?: Patient;
  user?: User;
  service?: Service;
}

export interface CreateAppointmentInput {
  patientId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  serviceId?: string; // Optional for now if not strictly required by frontend yet
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
