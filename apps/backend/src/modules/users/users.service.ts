import prisma from "../../config/db";
import { createError } from "../../middlewares/error.middleware";
import { UpdateUserInput } from "./users.schema";
import bcrypt from "bcryptjs";

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      schedules: true,
    },
  });
  if (!user) throw createError("User not found", 404);
  return user;
}

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw createError("User not found", 404);

  // Validate email uniqueness if changing
  if (data.email && data.email !== user.email) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw createError("Email already in use", 400);
  }

  // Handle password update
  let passwordHash = undefined;
  if (data.newPassword) {
    if (!data.currentPassword) {
      throw createError("Current password is required", 400);
    }
    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) throw createError("Invalid current password", 401);

    passwordHash = await bcrypt.hash(data.newPassword, 10);
  }

  return prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      ...(passwordHash && { password: passwordHash }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
