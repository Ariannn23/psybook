import { Router } from "express";
import * as medicalRecordsController from "./medical-records.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

import { upload } from "../../config/multer";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  upload.array("attachments"),
  medicalRecordsController.create,
);

router.get(
  "/:patientId",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  medicalRecordsController.getByPatient,
);

router.put(
  "/:id",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  medicalRecordsController.update,
);

router.delete(
  "/:id",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  medicalRecordsController.remove,
);

export default router;
