import { Request, Response } from "express";
import { prisma as db } from "../../config/db";

export const getAll = async (req: Request, res: Response) => {
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
};

export const markAsRead = async (req: Request, res: Response) => {
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
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    await db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return res.json({ message: "Todas las notificaciones marcadas como leídas" });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return res.status(500).json({ error: "Error al actualizar notificaciones" });
  }
};

export const remove = async (req: Request, res: Response) => {
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
};
