/**
 * 🔄 Mapper de Notifications
 * Transforma datos entre DB y Domain
 */

import type { Notification } from "../core/types";

export interface NotificationDTO {
  id: string;
  userId: string;
  type: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export interface CreateNotificationInput {
  userId: string;
  type:
    | "new_message"
    | "new_favorite"
    | "purchase_request"
    | "review_received"
    | "item_sold";
  data: Record<string, any>;
}

export const notificationMapper = {
  // DB Row → DTO
  toDTO(notification: Notification): NotificationDTO {
    return {
      id: notification.id,
      userId: notification.user_id,
      type: notification.type,
      data: notification.data as Record<string, any>,
      read: notification.read,
      createdAt: new Date(notification.created_at),
    };
  },

  // CreateNotificationInput → DB Insert
  toInsert(input: CreateNotificationInput) {
    return {
      user_id: input.userId,
      type: input.type,
      data: input.data,
    };
  },

  // Array
  toDTOArray(notifications: Notification[]): NotificationDTO[] {
    return notifications.map((n) => this.toDTO(n));
  },
};
