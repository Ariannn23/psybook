import prisma from "../../config/db";
import { createError } from "../../middlewares/error.middleware";
import { CreatePatientInput, UpdatePatientInput } from "./patients.schema";

export async function createPatient(data: CreatePatientInput) {
  return prisma.patient.create({ data });
}

export async function getAllPatients() {
  return prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { appointments: true } } },
  });
}

export async function getPatientById(id: string) {
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        include: { service: true, user: { select: { id: true, name: true } } },
      },
    },
  });
  if (!patient) throw createError("Patient not found", 404);
  return patient;
}

export async function updatePatient(id: string, data: UpdatePatientInput) {
  const exists = await prisma.patient.findUnique({ where: { id } });
  if (!exists) throw createError("Patient not found", 404);
  return prisma.patient.update({ where: { id }, data });
}

export async function deletePatient(id: string) {
  const exists = await prisma.patient.findUnique({ where: { id } });
  if (!exists) throw createError("Patient not found", 404);
  return prisma.patient.delete({ where: { id } });
}
