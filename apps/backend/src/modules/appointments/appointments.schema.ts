import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid(),
  userId: z.string().uuid(), // psychologist
  serviceId: z.string().uuid(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date format YYYY-MM-DD required"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM required"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM required"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  notes: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  date: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
