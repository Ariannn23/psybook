import { z } from "zod";

export const createMedicalRecordSchema = z.object({
  patientId: z.string().uuid("Invalid patient ID"),
  content: z.string().min(1, "Content is required"),
  attachments: z.array(z.string()).optional(),
});

export type CreateMedicalRecordInput = z.infer<
  typeof createMedicalRecordSchema
>;

export const updateMedicalRecordSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export type UpdateMedicalRecordInput = z.infer<
  typeof updateMedicalRecordSchema
>;
