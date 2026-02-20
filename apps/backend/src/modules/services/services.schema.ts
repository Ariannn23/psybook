import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  duration: z.number().int().positive("Duration must be a positive integer"), // in minutes
  price: z.number().positive("Price must be a positive number"),
  isActive: z.boolean().optional().default(true),
});

export const updateServiceSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
