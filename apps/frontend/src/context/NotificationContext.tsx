import { createContext, useContext, type ReactNode } from "react";
import { useNotifications, type Notification } from "@/hooks/useNotifications";

export type { Notification };

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    message: string,
    type?: Notification["type"],
  ) => Promise<string>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider",
    );
  }
  return context;
}
