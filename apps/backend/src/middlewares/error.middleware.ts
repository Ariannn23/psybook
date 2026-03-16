import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export interface AppError extends Error {
  statusCode?: number;
}

export function errorMiddleware(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode || 500;
  const isProd = process.env.NODE_ENV === "production";
  const message =
    statusCode >= 500 && isProd
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  logger.error(`[ERROR] ${statusCode}: ${message}`);
  if (!isProd) {
    logger.debug(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export function createError(message: string, statusCode: number): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  return error;
}
