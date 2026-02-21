import { Request, Response, NextFunction } from "express";
import * as servicesService from "../services/services.service";
import * as appointmentsService from "../appointments/appointments.service";
import prisma from "../../config/db";
import {
  format,
  parseISO,
  addMinutes,
  isAfter,
  isBefore,
  startOfDay,
  getDay,
} from "date-fns";
import { z } from "zod";

export async function getPublicServices(
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

export async function getPublicDoctor(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const doctor = await prisma.user.findFirst({
      where: { role: "PSYCHOLOGIST" },
      select: {
        id: true,
        name: true,
      },
    });

    if (!doctor) {
      res.status(404).json({ success: false, message: "No doctor found" });
      return;
    }

    res.json({ success: true, data: doctor });
  } catch (error) {
    next(error);
  }
}

export async function getPublicDoctors(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: "PSYCHOLOGIST" },
      select: {
        id: true,
        name: true,
      },
    });
    res.json({ success: true, data: doctors });
  } catch (error) {
    next(error);
  }
}

export async function getAvailableSlots(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { date, serviceId, doctorId } = req.query as {
      date: string;
      serviceId: string;
      doctorId: string;
    };

    if (!date) {
      res.status(400).json({ success: false, message: "Date is required" });
      return;
    }

    if (!doctorId) {
      res
        .status(400)
        .json({ success: false, message: "Doctor ID is required" });
      return;
    }

    // 1. Verify doctor
    const doctor = await prisma.user.findFirst({
      where: { id: doctorId, role: "PSYCHOLOGIST" },
    });

    if (!doctor) {
      res
        .status(404)
        .json({ success: false, message: "Psychologist not found" });
      return;
    }

    // 2. Get service duration (default to 60 if not found)
    let duration = 60;
    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });
      if (service) duration = service.duration;
    }

    // 3. Get schedules for this weekday
    const selectedDate = parseISO(date);
    const weekday = getDay(selectedDate); // 0 (Sun) to 6 (Sat)

    const schedules = await prisma.schedule.findMany({
      where: {
        userId: doctor.id,
        day: weekday,
      },
    });

    if (schedules.length === 0) {
      res.json({ success: true, data: [] });
      return;
    }

    // 4. Get existing appointments for this date
    // Need to handle the date at midnight UTC as per appointments.service.ts
    const [year, month, day] = date.split("-").map(Number);
    const appointmentDate = new Date(Date.UTC(year, month - 1, day));

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        userId: doctor.id,
        date: appointmentDate,
        status: { not: "CANCELLED" },
      },
    });

    // 5. Generate slots logic
    const allSlots: string[] = [];

    const parseTimeToMinutes = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const formatMinutesToTime = (totalMinutes: number) => {
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    };

    for (const schedule of schedules) {
      const startMinutes = parseTimeToMinutes(schedule.startTime);
      const endMinutes = parseTimeToMinutes(schedule.endTime);

      let current = startMinutes;
      while (current + duration <= endMinutes) {
        const slotStart = current;
        const slotEnd = current + duration;

        // Check for overlaps with existing appointments
        const hasConflict = existingAppointments.some((app) => {
          const appStart = parseTimeToMinutes(app.startTime);
          const appEnd = parseTimeToMinutes(app.endTime);
          // Overlap: (StartA < EndB) and (EndA > StartB)
          return slotStart < appEnd && slotEnd > appStart;
        });

        if (!hasConflict) {
          // If the date is today, only show future slots
          const isToday = format(new Date(), "yyyy-MM-dd") === date;
          if (isToday) {
            const now = new Date();
            const slotDateTime = new Date(selectedDate);
            slotDateTime.setHours(
              Math.floor(slotStart / 60),
              slotStart % 60,
              0,
              0,
            );

            if (isAfter(slotDateTime, now)) {
              allSlots.push(formatMinutesToTime(slotStart));
            }
          } else {
            allSlots.push(formatMinutesToTime(slotStart));
          }
        }

        current += 30; // Increment by 30 mins to offer more flexibility/start times
      }
    }

    res.json({ success: true, data: [...new Set(allSlots)].sort() });
  } catch (error) {
    next(error);
  }
}

export async function createPublicAppointment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bookingSchema = z.object({
      serviceId: z.string().uuid(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      startTime: z.string().regex(/^\d{2}:\d{2}$/),
      patientData: z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        dni: z.string().min(1),
      }),
    });

    const body = bookingSchema.parse(req.body);

    const { doctorId } = req.body;

    if (!doctorId) {
      res
        .status(400)
        .json({ success: false, message: "Doctor ID is required" });
      return;
    }

    // 1. Verify doctor
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId, role: "PSYCHOLOGIST" },
    });

    if (!doctor) {
      res
        .status(404)
        .json({ success: false, message: "Psychologist not found" });
      return;
    }

    // 2. Find or Create Patient (Idempotent by DNI or Email)
    let patient = await prisma.patient.findFirst({
      where: {
        OR: [{ dni: body.patientData.dni }, { email: body.patientData.email }],
      },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name: body.patientData.name,
          email: body.patientData.email,
          phone: body.patientData.phone,
          dni: body.patientData.dni,
        },
      });
    }

    // 3. Calculate End Time
    const service = await prisma.service.findUnique({
      where: { id: body.serviceId },
    });
    if (!service) {
      res.status(404).json({ success: false, message: "Service not found" });
      return;
    }

    const [startH, startM] = body.startTime.split(":").map(Number);
    const startInMinutes = startH * 60 + startM;
    const endInMinutes = startInMinutes + service.duration;

    const endH = Math.floor(endInMinutes / 60);
    const endM = endInMinutes % 60;
    const endTime = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

    // 4. Create Appointment using the internal service
    const appointment = await appointmentsService.createAppointment({
      patientId: patient.id,
      userId: doctor.id,
      serviceId: body.serviceId,
      date: body.date,
      startTime: body.startTime,
      endTime: endTime,
      reason: "Reserva pública de paciente",
    });

    // 5. Create Dashboard Notification for the psychologist
    await prisma.notification.create({
      data: {
        userId: doctor.id,
        message: `Nueva reserva pública: ${body.patientData.name} para ${service.name} el ${body.date} a las ${body.startTime}`,
        type: "success",
      },
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}
