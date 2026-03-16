import { Request, Response, NextFunction } from "express";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "./appointments.schema";
import * as appointmentsService from "./appointments.service";
import { createError } from "../../middlewares/error.middleware";
import { AppointmentStatus } from "@prisma/client";

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
    const authenticatedUserId = requireUserId(req);
    const { date, status } = req.query as { date?: unknown; status?: unknown };
    const dateFilter = typeof date === "string" ? date : undefined;
    const statusFilter =
      typeof status === "string" &&
      (Object.values(AppointmentStatus) as string[]).includes(status)
        ? (status as AppointmentStatus)
        : undefined;

    const appointments = await appointmentsService.getAllAppointments({
      userId: authenticatedUserId, // Force use of authenticated userId
      date: dateFilter,
      status: statusFilter,
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
    const authenticatedUserId = requireUserId(req);
    const appointment = await appointmentsService.getAppointmentById(
      req.params.id,
    );

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
    const authenticatedUserId = requireUserId(req);

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
    const authenticatedUserId = requireUserId(req);

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
