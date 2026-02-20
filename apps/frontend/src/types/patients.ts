import type { Appointment } from "./appointments";

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  appointments?: Appointment[];
}

export interface CreatePatientInput {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface UpdatePatientInput extends Partial<CreatePatientInput> {}
