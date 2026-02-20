import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import * as dashboardController from "./dashboard.controller";

const router = Router();

router.get("/stats", authMiddleware, dashboardController.getDashboardStats);

export default router;
