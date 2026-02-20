import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "./auth.schema";
import { registerService, loginService, getMeService } from "./auth.service";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerService(data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginService(data);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user!.id;
    const user = await getMeService(userId);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}
