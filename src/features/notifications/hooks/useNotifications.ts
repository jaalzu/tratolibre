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
    // 1. Evitar fetch si ya tenemos la data y no hay nada nuevo
    const hasData = notifications.length > 0;
    const hasNew = unreadCount > 0;

    if (hasData && !hasNew) return;

    setLoading(true);
    try {
      await fetchNotifications();

      // 2. Marcar como leído solo si es necesario
      if (hasNew) {
        await markAllNotificationsRead();
        resetUnreadCount();
      }
    } catch (error) {
      console.error("Error al cargar notificaciones", error);
    } finally {
      setLoading(false);
    }
  };

  return { notifications, unreadCount, loading, fetchAndMarkRead };
}
