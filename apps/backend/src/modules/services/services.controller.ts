import { Request, Response, NextFunction } from "express";
import { createServiceSchema, updateServiceSchema } from "./services.schema";
import * as servicesService from "./services.service";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = createServiceSchema.parse(req.body);
    const service = await servicesService.createService(data);
    res.status(201).json({ success: true, data: service });
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
    const services = await servicesService.getAllServices();
    res.json({ success: true, data: services });
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
    const service = await servicesService.getServiceById(req.params.id);
    res.json({ success: true, data: service });
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
    const data = updateServiceSchema.parse(req.body);
    const service = await servicesService.updateService(req.params.id, data);
    res.json({ success: true, data: service });
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
    await servicesService.deleteService(req.params.id);
    res.json({ success: true, message: "Service deleted" });
  } catch (error) {
    next(error);
  }
}
