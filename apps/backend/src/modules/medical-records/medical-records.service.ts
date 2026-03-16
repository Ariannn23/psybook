import prisma from "../../config/db";
import { createError } from "../../middlewares/error.middleware";
import {
  CreateMedicalRecordInput,
  UpdateMedicalRecordInput,
} from "./medical-records.schema";

export async function createMedicalRecord(
  userId: string,
  data: CreateMedicalRecordInput,
) {
  // Verify patient exists
  const patient = await prisma.patient.findUnique({
    where: { id: data.patientId },
  });
  if (!patient) throw createError("Patient not found", 404);

  return prisma.medicalRecord.create({
    data: {
      userId,
      content: data.content,
      patientId: data.patientId,
      attachments: data.attachments || [],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getMedicalRecordsByPatient(
  patientId: string,
  userId: string,
) {
  return prisma.medicalRecord.findMany({
    where: { patientId, userId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function updateMedicalRecord(
  id: string,
  userId: string,
  data: UpdateMedicalRecordInput,
) {
  const record = await prisma.medicalRecord.findUnique({ where: { id } });
  if (!record) throw createError("Medical record not found", 404);

  // Only the author or an admin can edit? For now, let's say only author.
  if (record.userId !== userId) {
    throw createError("You can only edit your own records", 403);
  }

  return prisma.medicalRecord.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true } },
    },
  });
}

export async function deleteMedicalRecord(id: string, userId: string) {
  const record = await prisma.medicalRecord.findUnique({ where: { id } });
  if (!record) throw createError("Medical record not found", 404);

  if (record.userId !== userId) {
    throw createError("You can only delete your own records", 403);
  }

  return prisma.medicalRecord.delete({ where: { id } });
}
