import { Router } from "express";
import * as schedulesController from "./schedules.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

// Apply auth middleware to all schedule routes
router.use(authMiddleware);

// Only psychologists (and admins) should manage schedules
router.post(
  "/",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  schedulesController.create,
);

router.get(
  "/",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  schedulesController.getAll,
);

router.delete(
  "/:id",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  schedulesController.remove,
);

router.patch(
  "/:id",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  schedulesController.update,
);

export default router;
