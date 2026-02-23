import { Request, Response, NextFunction } from "express";
import * as medicalRecordsService from "./medical-records.service";
import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
} from "./medical-records.schema";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // @ts-ignore
    const userId = req.user.id;

    // Handle file uploads
    let attachments: string[] = [];
    const files = (req as any).files;
    if (files && Array.isArray(files)) {
      attachments = files.map((file: any) => file.filename);
    }

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
    const records =
      await medicalRecordsService.getMedicalRecordsByPatient(patientId);
    res.json(records);
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
    // @ts-ignore
    const userId = req.user.id;
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
    // @ts-ignore
    const userId = req.user.id;
    await medicalRecordsService.deleteMedicalRecord(id, userId);
    res.json({ success: true, message: "Medical record deleted" });
  } catch (error) {
    next(error);
  }
}
