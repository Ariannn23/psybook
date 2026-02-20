import { z } from "zod";

export const createScheduleSchema = z
  .object({
    day: z
      .number()
      .int()
      .min(0, "Day must be between 0 (Sunday) and 6 (Saturday)")
      .max(6, "Day must be between 0 (Sunday) and 6 (Saturday)"),
    startTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM)",
      ),
    endTime: z
      .string()
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM)",
      ),
  })
  .refine(
    (data) => {
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);

      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;

      return endTotal > startTotal;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
