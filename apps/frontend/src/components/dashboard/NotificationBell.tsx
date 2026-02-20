import { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useNotificationContext } from "@/context/NotificationContext";
import type { Notification } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotificationContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "text-emerald-600 bg-emerald-50";
      case "warning":
        return "text-amber-600 bg-amber-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Ahora";
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-110 hover:shadow-md group cursor-pointer"
        title="Notificaciones"
      >
        <Bell
          size={24}
          className={cn(
            "text-slate-500 transition-all duration-200",
            unreadCount > 0 && "text-emerald-600",
            "group-hover:text-emerald-600 group-hover:animate-pulse",
          )}
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-linear-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse-glow ring-2 ring-red-200">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-200/50 z-50 max-h-96 overflow-hidden flex flex-col animate-slide-in">
          <div className="p-4 border-b border-slate-200/50 bg-linear-to-r from-slate-50/50 to-white flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-all duration-200"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-linear-to-r hover:from-slate-50 hover:to-emerald-50/30 transition-all duration-200 cursor-pointer border-l-2",
                      !notification.read
                        ? "bg-blue-50/50 border-l-emerald-500"
                        : "border-l-transparent",
                    )}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-lg shrink-0",
                          getNotificationColor(notification.type),
                        )}
                      >
                        <Bell size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm",
                            !notification.read
                              ? "font-semibold text-slate-800"
                              : "text-slate-600",
                          )}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="p-1 hover:bg-slate-200 rounded transition-colors shrink-0 cursor-pointer"
                        title="Eliminar notificación"
                      >
                        <X size={14} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
