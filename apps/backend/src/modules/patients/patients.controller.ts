import { Request, Response, NextFunction } from "express";
import { createPatientSchema, updatePatientSchema } from "./patients.schema";
import * as patientService from "./patients.service";
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
    const data = createPatientSchema.parse({ ...req.body, userId });
    const patient = await patientService.createPatient(data);
    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
}

export async function getAll(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = requireUserId(req);
    const patients = await patientService.getAllPatients(userId);
    res.json({ success: true, data: patients });
  } catch (error) {
    next(error);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = requireUserId(req);
    const patient = await patientService.getPatientById(req.params.id, userId);
    res.json({ success: true, data: patient });
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
    const userId = requireUserId(req);
    const data = updatePatientSchema.parse(req.body);
    const patient = await patientService.updatePatient(
      req.params.id,
      userId,
      data,
    );
    res.json({ success: true, data: patient });
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
    const userId = requireUserId(req);
    await patientService.deletePatient(req.params.id, userId);
    res.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    next(error);
  }
}
