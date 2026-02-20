import { Request, Response, NextFunction } from "express";
import { createPatientSchema, updatePatientSchema } from "./patients.schema";
import * as patientService from "./patients.service";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = createPatientSchema.parse(req.body);
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
    const patients = await patientService.getAllPatients();
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
    const patient = await patientService.getPatientById(req.params.id);
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
    const data = updatePatientSchema.parse(req.body);
    const patient = await patientService.updatePatient(req.params.id, data);
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
    await patientService.deletePatient(req.params.id);
    res.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    next(error);
  }
}
