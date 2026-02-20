import { Router } from "express";
import * as servicesController from "./services.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

// Public? Or protected? Services usually need to be public for landing page,
// but for now we are building an internal dashboard.
// Let's protect everything for now, can open up GET later.
router.use(authMiddleware);

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     responses:
 *       200:
 *         description: List of services
 */
router.get("/", servicesController.getAll);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service (Admin/Psychologist)
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, duration, price]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Service created
 */
router.post(
  "/",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  servicesController.create,
);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service data
 */
router.get("/:id", servicesController.getById);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update service
 *     tags: [Services]
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
 *         description: Service updated
 */
router.put(
  "/:id",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  servicesController.update,
);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Services]
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
 *         description: Service deleted
 */
router.delete(
  "/:id",
  roleMiddleware("PSYCHOLOGIST", "ADMIN"),
  servicesController.remove,
);

export default router;
