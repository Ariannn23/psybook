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
    // @ts-ignore
    const authenticatedUserId = req.user.id;
    const { date, status } = req.query;
    const appointments = await appointmentsService.getAllAppointments({
      userId: authenticatedUserId, // Force use of authenticated userId
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
    // @ts-ignore
    const authenticatedUserId = req.user.id;
    const appointment = await appointmentsService.getAppointmentById(
      req.params.id,
    );

    // Verify ownership
    if (appointment.userId !== authenticatedUserId) {
      res.status(404).json({ success: false, message: "Cita no encontrada" });
      return;
    }

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
    // @ts-ignore
    const authenticatedUserId = req.user.id;

    // First verify ownership
    const appointment = await appointmentsService.getAppointmentById(
      req.params.id,
    );
    if (appointment.userId !== authenticatedUserId) {
      res.status(404).json({ success: false, message: "Cita no encontrada" });
      return;
    }

    const data = updateAppointmentSchema.parse(req.body);
    const updatedAppointment = await appointmentsService.updateAppointment(
      req.params.id,
      data,
    );
    res.json({ success: true, data: updatedAppointment });
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
    // @ts-ignore
    const authenticatedUserId = req.user.id;

    // First verify ownership
    const appointment = await appointmentsService.getAppointmentById(
      req.params.id,
    );
    if (appointment.userId !== authenticatedUserId) {
      res.status(404).json({ success: false, message: "Cita no encontrada" });
      return;
    }

    await appointmentsService.deleteAppointment(req.params.id);
    res.json({ success: true, message: "Cita eliminada correctamente" });
  } catch (error) {
    next(error);
  }
}
