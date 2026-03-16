import { Request, Response, NextFunction } from "express";
import * as medicalRecordsService from "./medical-records.service";
import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
} from "./medical-records.schema";
import { createError } from "../../middlewares/error.middleware";

function requireUserId(req: Request): string {
  const userId = req.user?.id;
  if (!userId) throw createError("No autorizado", 401);
  return userId;
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = requireUserId(req);

    let attachments: string[] = [];
    const files = req.files as Express.Multer.File[] | undefined;
    attachments = (files || []).map((file) => file.filename);

    const body = {
      ...req.body,
      attachments,
    };

    const data = createMedicalRecordSchema.parse(body);
    const record = await medicalRecordsService.createMedicalRecord(
      userId,
      data,
    );
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
}

export async function getByPatient(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { patientId } = req.params;
    const userId = requireUserId(req);
    const records =
      await medicalRecordsService.getMedicalRecordsByPatient(patientId, userId);
    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = requireUserId(req);
    const data = updateMedicalRecordSchema.parse(req.body);
    const record = await medicalRecordsService.updateMedicalRecord(
      id,
      userId,
      data,
    );
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = req.params;
    const userId = requireUserId(req);
    await medicalRecordsService.deleteMedicalRecord(id, userId);
    res.json({ success: true, message: "Medical record deleted" });
  } catch (error) {
    next(error);
  }
}
