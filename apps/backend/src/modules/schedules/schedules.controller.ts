import { Request, Response, NextFunction } from "express";
import * as schedulesService from "./schedules.service";
import { createScheduleSchema } from "./schedules.schema";
import { createError } from "../../middlewares/error.middleware";

function requireUserId(req: Request): string {
  const userId = req.user?.id;
  if (!userId) throw createError("No autorizado", 401);
  return userId;
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = requireUserId(req);
    const data = createScheduleSchema.parse(req.body);
    const schedule = await schedulesService.createSchedule(userId, data);
    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
}

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = requireUserId(req);
    const schedules = await schedulesService.getSchedules(userId);
    res.json(schedules);
  } catch (error) {
    next(error);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = requireUserId(req);
    await schedulesService.deleteSchedule(id, userId);
    res.json({ success: true, message: "Schedule deleted" });
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = requireUserId(req);
    const data = createScheduleSchema.parse(req.body);
    const schedule = await schedulesService.updateSchedule(id, userId, data);
    res.json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
}
