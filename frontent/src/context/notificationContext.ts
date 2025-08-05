import { createContext } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  message: string;
  type: NotificationType;
  id: string;
  duration?: number;
}

export interface NotificationContextType {
  notifications: Notification[];
  showNotification: (
    message: string,
    type: NotificationType,
    duration?: number,
  ) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  showNotification: () => {},
  hideNotification: () => {},
});

export default NotificationContext;
