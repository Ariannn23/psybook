import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import * as userController from "./users.controller";

const router = Router();

// Profile operations (Authenticated User)
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);

// Admin operations
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.listUsers,
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.getUser,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userController.removeUser,
);

export default router;
