import { useContext } from "react";
import NotificationContext from "./notificationContext";
import type { NotificationType } from "./notificationContext";

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }

  return {
    notifications: context.notifications,
    showNotification: (
      message: string,
      type: NotificationType = "info",
      duration?: number,
    ) => context.showNotification(message, type, duration),
    hideNotification: (id: string) => context.hideNotification(id),
  };
};
