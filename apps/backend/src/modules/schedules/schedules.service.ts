import prisma from "../../config/db";
import { createError } from "../../middlewares/error.middleware";
import { CreateScheduleInput } from "./schedules.schema";

export async function createSchedule(
  userId: string,
  data: CreateScheduleInput,
) {
  // Check for overlap on the same day for the same user
  const existingSchedules = await prisma.schedule.findMany({
    where: {
      userId,
      day: data.day,
    },
  });

  const newStart = parseTime(data.startTime);
  const newEnd = parseTime(data.endTime);

  for (const schedule of existingSchedules) {
    const existingStart = parseTime(schedule.startTime);
    const existingEnd = parseTime(schedule.endTime);

    // Overlap logic: (StartA < EndB) and (EndA > StartB)
    if (newStart < existingEnd && newEnd > existingStart) {
      throw createError("Schedule overlaps with an existing time slot", 409);
    }
  }

  return prisma.schedule.create({
    data: {
      userId,
      ...data,
    },
  });
}

export async function getSchedules(userId: string) {
  return prisma.schedule.findMany({
    where: { userId },
    orderBy: { day: "asc" },
  });
}

export async function deleteSchedule(id: string, userId: string) {
  const schedule = await prisma.schedule.findUnique({ where: { id } });
  if (!schedule) throw createError("Schedule not found", 404);
  if (schedule.userId !== userId) throw createError("Unauthorized", 403);

  return prisma.schedule.delete({ where: { id } });
}

// ... existing code ...
function parseTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export async function updateSchedule(
  id: string,
  userId: string,
  data: CreateScheduleInput,
) {
  const schedule = await prisma.schedule.findUnique({ where: { id } });
  if (!schedule) throw createError("Schedule not found", 404);
  if (schedule.userId !== userId) throw createError("Unauthorized", 403);

  // Check for overlap on the same day (excluding current schedule)
  const existingSchedules = await prisma.schedule.findMany({
    where: {
      userId,
      day: data.day,
      id: { not: id }, // Exclude current
    },
  });

  const newStart = parseTime(data.startTime);
  const newEnd = parseTime(data.endTime);

  for (const s of existingSchedules) {
    const existingStart = parseTime(s.startTime);
    const existingEnd = parseTime(s.endTime);

    if (newStart < existingEnd && newEnd > existingStart) {
      throw createError("Schedule overlaps with an existing time slot", 409);
    }
  }

  return prisma.schedule.update({
    where: { id },
    data,
  });
}
