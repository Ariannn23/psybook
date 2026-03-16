import { useState, useCallback, useEffect, useRef } from "react";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import type { ApiResponse } from "@/types/auth";

export interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
}

interface BackendNotification {
  id: string;
  message: string;
  type: Notification["type"];
  createdAt: string;
  isRead: boolean;
}

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const fetchInterval = useRef<number | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await api.get<ApiResponse<BackendNotification[]>>(
        "/notifications",
      );
      const rows = response.data.data ?? [];
      const mapped: Notification[] = rows.map((n) => ({
        id: n.id,
        message: n.message,
        type: n.type,
        timestamp: new Date(n.createdAt),
        read: n.isRead,
      }));
      setNotifications(mapped);
    } catch (error) {
    }
  }, [isAuthenticated]);

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
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
    }
  }, []);

  const removeNotification = useCallback(async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
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
