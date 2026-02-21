import { Request, Response } from "express";
import { prisma } from "../../config/db";

// GET /api/notifications - Obtener notificaciones del usuario actual
export async function getAll(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "No autorizado" });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al obtener notificaciones" });
  }
}

// Mark notification as read
export async function markAsRead(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return res
        .status(404)
        .json({ success: false, message: "Notificación no encontrada" });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.json(updated);
  } catch (error) {
    console.error("Error updating notification:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al actualizar notificación" });
  }
}

// DELETE /api/notifications/:id - Eliminar notificación
export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return res
        .status(404)
        .json({ success: false, message: "Notificación no encontrada" });
    }

    await prisma.notification.delete({
      where: { id },
    });

    return res.json({ success: true, message: "Notificación eliminada" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error al eliminar notificación" });
  }
}
