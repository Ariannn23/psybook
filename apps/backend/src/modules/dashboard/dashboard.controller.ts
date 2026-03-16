import { Request, Response, NextFunction } from "express";
import * as dashboardService from "./dashboard.service";
import { createError } from "../../middlewares/error.middleware";

export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;
    if (!userId) throw createError("No autorizado", 401);
    const data = await dashboardService.getDashboardStats(userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
