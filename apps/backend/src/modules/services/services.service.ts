import prisma from "../../config/db";
import { createError } from "../../middlewares/error.middleware";
import { CreateServiceInput, UpdateServiceInput } from "./services.schema";

export async function createService(data: CreateServiceInput) {
  return prisma.service.create({ data });
}

export async function getAllServices() {
  return prisma.service.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getServiceById(id: string) {
  const service = await prisma.service.findUnique({
    where: { id },
  });
  if (!service) throw createError("Service not found", 404);
  return service;
}

export async function updateService(id: string, data: UpdateServiceInput) {
  const exists = await prisma.service.findUnique({ where: { id } });
  if (!exists) throw createError("Service not found", 404);
  return prisma.service.update({ where: { id }, data });
}

export async function deleteService(id: string) {
  const exists = await prisma.service.findUnique({ where: { id } });
  if (!exists) throw createError("Service not found", 404);
  // Check if service has appointments? Prisma handles CASCADE or restrict?
  // Schema says nothing about OnDelete for Service -> Appointment, defaults to restrict usually or set null.
  // Wait, schema says: onDelete: Cascade. So it will delete appointments.
  // Might want to soft delete instead? For now, hard delete is simple.
  return prisma.service.delete({ where: { id } });
}
