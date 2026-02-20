import { Router, Request, Response } from "express";
import { db } from "@/config/db";
import { formatISO } from "date-fns";

const router = Router();

// GET /api/notifications - Obtener notificaciones del usuario actual
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ error: "Error al obtener notificaciones" });
  }
});

// Mark notification as read
router.patch("/:id/read", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const notification = await db.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    const updated = await db.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({ error: "Error al actualizar notificación" });
  }
});

// DELETE /api/notifications/:id - Eliminar notificación
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const notification = await db.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    await db.notification.delete({
      where: { id },
    });

    return res.json({ message: "Notificación eliminada" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ error: "Error al eliminar notificación" });
  }
});

export default router;
