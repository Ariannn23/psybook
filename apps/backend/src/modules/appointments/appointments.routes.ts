import { Router } from "express";
import * as appointmentsController from "./appointments.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create appointment (public - patient books directly)
 *     tags: [Appointments]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, userId, serviceId, date, startTime, endTime]
 *             properties:
 *               patientId:
 *                 type: string
 *               userId:
 *                 type: string
 *               serviceId:
 *                 type: string
 *               date:
 *                 type: string
 *                 example: "2024-03-15"
 *               startTime:
 *                 type: string
 *                 example: "10:00"
 *               endTime:
 *                 type: string
 *                 example: "11:00"
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 *       409:
 *         description: Time slot already booked
 */
router.post("/", authMiddleware, appointmentsController.create);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments (filterable by ?userId= &date= &status=)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED]
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get("/", authMiddleware, appointmentsController.getAll);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment data
 */
router.get("/:id", authMiddleware, appointmentsController.getById);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update appointment status or notes
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 */
router.put("/:id", authMiddleware, appointmentsController.update);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete appointment (Admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment deleted
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  appointmentsController.remove,
);

export default router;
