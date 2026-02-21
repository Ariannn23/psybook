import { Request, Response, NextFunction } from "express";
import * as dashboardService from "./dashboard.service";

export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const data = await dashboardService.getDashboardStats(userId);
    res.json({ success: true, data });
  } catch (error) {
    console.error("DEBUG: Dashboard stats error:", error);
    next(error);
  }
}
