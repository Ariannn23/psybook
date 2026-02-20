import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email").optional(),
    currentPassword: z
      .string()
      .min(1, "Current password is required if changing password")
      .optional(),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    },
  );

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
