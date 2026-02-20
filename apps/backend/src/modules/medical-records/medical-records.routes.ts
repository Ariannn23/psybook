import { Router } from "express";
import * as medicalRecordsController from "./medical-records.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

import { upload } from "../../config/multer";

const router = Router();

router.use(authMiddleware);

// Create a record (Psychologists only)
router.post(
  "/",
  authMiddleware, // Ensure auth middleware is applied
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upload.array("attachments") as any, // Support multiple files
  medicalRecordsController.create,
);

// Get records for a patient (Psychologists and Admin)
router.get(
  "/:patientId",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  medicalRecordsController.getByPatient,
);

// Update a record
router.put(
  "/:id",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  medicalRecordsController.update,
);

// Delete a record
router.delete(
  "/:id",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  medicalRecordsController.remove,
);

export default router;
