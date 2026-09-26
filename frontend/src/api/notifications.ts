import { apiRequest } from "./client";

export type Notification = {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
};

export const getMyNotifications = () =>
  apiRequest<Notification[]>("/notifications");

export const markNotificationRead = (id: number) =>
  apiRequest(`/notifications/${id}/read`, { method: "PATCH" });
