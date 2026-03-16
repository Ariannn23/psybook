import { Router } from "express";
import * as publicController from "./public.controller";

const router = Router();

router.get("/services", publicController.getPublicServices);

router.get("/doctors", publicController.getPublicDoctors);
router.get("/doctor", publicController.getPublicDoctor);

router.get("/slots", publicController.getAvailableSlots);

router.post("/appointments", publicController.createPublicAppointment);

export default router;
