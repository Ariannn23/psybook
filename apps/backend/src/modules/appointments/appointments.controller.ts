import { Request, Response, NextFunction } from "express";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "./appointments.schema";
import * as appointmentsService from "./appointments.service";

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Inject userId from the authenticated user
    // @ts-ignore
    const userId = req.user.id;
    const bodyWithUser = { ...req.body, userId };

    const data = createAppointmentSchema.parse(bodyWithUser);
    const appointment = await appointmentsService.createAppointment(data);
    res.status(201).json({ success: true, data: appointment });
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
    const { userId, date, status } = req.query;
    const appointments = await appointmentsService.getAllAppointments({
      userId: userId as string,
      date: date as string,
      status: status as string,
    });
    res.json({ success: true, data: appointments });
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
    const appointment = await appointmentsService.getAppointmentById(
      req.params.id,
    );
    res.json({ success: true, data: appointment });
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
    const data = updateAppointmentSchema.parse(req.body);
    const appointment = await appointmentsService.updateAppointment(
      req.params.id,
      data,
    );
    res.json({ success: true, data: appointment });
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
    await appointmentsService.deleteAppointment(req.params.id);
    res.json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    next(error);
  }
}
