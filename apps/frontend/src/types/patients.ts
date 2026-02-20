import type { Appointment } from "./appointments";

export interface Patient {
  id: string;
  name: string;
  dni: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  appointments?: Appointment[];
}

export interface CreatePatientInput {
  name: string;
  dni: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {}
