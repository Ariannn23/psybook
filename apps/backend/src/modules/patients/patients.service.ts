import prisma from "../../config/db";
import { createError } from "../../middlewares/error.middleware";
import { CreatePatientInput, UpdatePatientInput } from "./patients.schema";

export async function createPatient(data: CreatePatientInput) {
  return prisma.patient.create({ data });
}

export async function getAllPatients(userId: string) {
  return prisma.patient.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { appointments: true } },
      appointments: {
        where: { userId, status: "COMPLETED" },
        orderBy: [{ date: "desc" }, { startTime: "desc" }],
        take: 1,
        include: { service: true },
      },
    },
  });
}

export async function getPatientById(id: string, userId: string) {
  const patient = await prisma.patient.findFirst({
    where: { id, userId },
    include: {
      appointments: {
        where: { userId },
        include: { service: true, user: { select: { id: true, name: true } } },
      },
    },
  });
  if (!patient) throw createError("Patient not found", 404);
  return patient;
}

export async function updatePatient(
  id: string,
  userId: string,
  data: UpdatePatientInput,
) {
  const exists = await prisma.patient.findFirst({ where: { id, userId } });
  if (!exists) throw createError("Patient not found", 404);
  return prisma.patient.update({ where: { id }, data });
}

export async function deletePatient(id: string, userId: string) {
  const exists = await prisma.patient.findFirst({ where: { id, userId } });
  if (!exists) throw createError("Patient not found", 404);
  return prisma.patient.delete({ where: { id } });
}
