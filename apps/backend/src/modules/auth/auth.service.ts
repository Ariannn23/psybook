import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/db";
import { env } from "../../config/env";
import { RegisterInput, LoginInput } from "./auth.schema";
import { createError } from "../../middlewares/error.middleware";
import { UserPayload } from "../../utils/types";

export async function registerService(data: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw createError("Email already registered", 409);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });

  return { user, token };
}

export async function loginService(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) throw createError("Invalid credentials", 401);

  const passwordMatch = await bcrypt.compare(data.password, user.password);
  if (!passwordMatch) throw createError("Invalid credentials", 401);

  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });

  const { password: _password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

export async function getMeService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) throw createError("User not found", 404);
  return user;
}
