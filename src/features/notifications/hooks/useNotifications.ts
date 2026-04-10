"use client";

import { useState } from "react";
import { markAllNotificationsRead } from "../actions/mutations/markAllNotificationsRead";
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

/**
 * Hook principal para gestionar notificaciones con lógica de fetch y marcado como leído
 * @param userId - ID del usuario
 * @param initialCount - Conteo inicial de notificaciones no leídas
 * @returns Estado de notificaciones, loading y función para fetch + mark read
 */
export function useNotifications({
  userId,
  initialCount,
}: UseNotificationsProps): UseNotificationsReturn {
  const [loading, setLoading] = useState(false);
  const { notifications, unreadCount, fetchNotifications, resetUnreadCount } =
    useNotificationsData({ userId, initialCount });

  const fetchAndMarkRead = async () => {
    // Evitar fetch si ya tenemos data y no hay nada nuevo
    const hasData = notifications.length > 0;
    const hasNew = unreadCount > 0;

    if (hasData && !hasNew) return;

    setLoading(true);
    try {
      await fetchNotifications();

      // Marcar como leído solo si es necesario
      if (hasNew) {
        await markAllNotificationsRead();
        resetUnreadCount();
      }
    } catch (error) {
      console.error(
        "[useNotifications] Error al cargar notificaciones:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  return { notifications, unreadCount, loading, fetchAndMarkRead };
}
