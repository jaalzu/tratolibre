"use client";

import { useState } from "react";
import { markAllNotificationsRead } from "@/features/notifications/actions";
import { useNotificationsData } from "./useNotificationsData";
import type { Notification } from "../types";

interface UseNotificationsProps {
  userId: string;
  initialCount: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchAndMarkRead: () => Promise<void>;
}

export function useNotifications({
  userId,
  initialCount,
}: UseNotificationsProps): UseNotificationsReturn {
  const [loading, setLoading] = useState(false);
  const { notifications, unreadCount, fetchNotifications, resetUnreadCount } =
    useNotificationsData({ userId, initialCount });

  const fetchAndMarkRead = async () => {
    setLoading(true);
    await fetchNotifications();
    setLoading(false);

    if (unreadCount > 0) {
      await markAllNotificationsRead();
      resetUnreadCount();
    }
  };

  return { notifications, unreadCount, loading, fetchAndMarkRead };
}
