import React, { useState } from "react";
import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import NotificationContext from "./notificationContext";
import type { NotificationType, Notification } from "./notificationContext";

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (
    message: string,
    type: NotificationType = "info",
    duration = 3000,
  ) => {
    const id = Date.now().toString();
    const notification: Notification = { message, type, id, duration };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }

    return id;
  };

  const hideNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5" />;
      case "error":
        return <X className="w-5 h-5" />;
      case "info":
        return (
          <span className="w-5 h-5 flex items-center justify-center font-bold">
            i
          </span>
        );
      case "warning":
        return (
          <span className="w-5 h-5 flex items-center justify-center font-bold">
            !
          </span>
        );
      default:
        return null;
    }
  };

  const getNotificationClassNames = (type: NotificationType): string => {
    switch (type) {
      case "success":
        return "bg-emerald-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
        return "bg-blue-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, hideNotification }}
    >
      {children}

      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-6 py-3 rounded-md shadow-lg flex items-center space-x-2 transition-all duration-300 ${getNotificationClassNames(notification.type)}`}
          >
            {getNotificationIcon(notification.type)}
            <span className="flex-1">{notification.message}</span>
            <button
              onClick={() => hideNotification(notification.id)}
              className="ml-2 text-white hover:text-gray-100"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
