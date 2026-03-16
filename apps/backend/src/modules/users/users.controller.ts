import { Request, Response, NextFunction } from "express";
import * as userService from "./users.service";
import { updateUserSchema } from "./users.schema";
import { createError } from "../../middlewares/error.middleware";

function requireUserId(req: Request): string {
  const userId = req.user?.id;
  if (!userId) throw createError("No autorizado", 401);
  return userId;
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = requireUserId(req);
    const user = await userService.getUserById(userId);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = requireUserId(req);
    const data = updateUserSchema.parse(req.body);
    const updatedUser = await userService.updateUser(userId, data);
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function removeUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
}
