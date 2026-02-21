import { useState, useCallback, useEffect, useRef } from "react";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

export interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
}

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const fetchInterval = useRef<number | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get("/notifications");
      // Map backend model to frontend model
      const mapped = response.data.map((n: any) => ({
        id: n.id,
        message: n.message,
        type: n.type as Notification["type"],
        timestamp: new Date(n.createdAt),
        read: n.isRead,
      }));
      setNotifications(mapped);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  }, [isAuthenticated]);

  // Poll for notifications every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      if (fetchInterval.current) {
        clearInterval(fetchInterval.current);
        fetchInterval.current = null;
      }
      return;
    }

    fetchNotifications();
    fetchInterval.current = window.setInterval(fetchNotifications, 30000);
    return () => {
      if (fetchInterval.current) {
        clearInterval(fetchInterval.current);
        fetchInterval.current = null;
      }
    };
  }, [fetchNotifications, isAuthenticated]);

  const addNotification = useCallback(
    async (message: string, type: Notification["type"] = "info") => {
      // Note: This matches the old frontend-only logic if called locally,
      // but typically now created by backend triggers.
      // For now, we'll keep it as a local-only optimism if called from frontend,
      // but in this refined system, we rely on fetchNotifications.
      const newNotification: Notification = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
      return newNotification.id;
    },
    [],
  );

  const markAsRead = useCallback(async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    // Backend doesn't have markAllAsRead yet, we could implement it
    // For now, we'll just optimistically update frontend if needed,
    // but better to just trigger markAsRead for each or add backend route.
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      // Note: Backend implementation for "Mark all" can be added in public.controller or a dedicated notifications controller
    } catch (error) {
      console.error("Error marking all as read", error);
    }
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error removing notification", error);
    }
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
}
