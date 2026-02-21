import { Router } from "express";
import * as publicController from "./public.controller";

const router = Router();

// Publicly available psychological services
router.get("/services", publicController.getPublicServices);

// Publicly available doctor info
router.get("/doctors", publicController.getPublicDoctors);
router.get("/doctor", publicController.getPublicDoctor);

// Publicly available time slots for a specific date
router.get("/slots", publicController.getAvailableSlots);

// Create a public appointment
router.post("/appointments", publicController.createPublicAppointment);

export default router;
