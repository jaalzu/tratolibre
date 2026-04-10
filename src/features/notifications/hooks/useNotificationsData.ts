"use client";

import { useEffect, useState } from "react";
import { getMyNotifications } from "../actions/queries/getMyNotifications";
import { getUnreadCount } from "../actions/queries/getUnreadCount";
import type { Notification } from "../types";

interface UseNotificationsDataProps {
  userId: string;
  initialCount: number;
}

interface UseNotificationsDataReturn {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<Notification[]>;
  resetUnreadCount: () => void;
}

/**
 * Hook para manejar el estado y subscripción de notificaciones en tiempo real
 * @param userId - ID del usuario
 * @param initialCount - Conteo inicial de notificaciones no leídas
 * @returns Estado de notificaciones y funciones para actualizarlo
 */
export function useNotificationsData({
  userId,
  initialCount,
}: UseNotificationsDataProps): UseNotificationsDataReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialCount);

  useEffect(() => {
    let channel: any;
    let supabaseInstance: any;

    const setupRealtime = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        supabaseInstance = createClient();

        channel = supabaseInstance
          .channel("notifications-badge")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${userId}`,
            },
            async () => {
              const newCount = await getUnreadCount();
              setUnreadCount(newCount);
            },
          )
          .subscribe();
      } catch (error) {
        console.error(
          "[useNotificationsData] Error setting up realtime:",
          error,
        );
      }
    };

    setupRealtime();

    return () => {
      if (supabaseInstance && channel) {
        supabaseInstance.removeChannel(channel);
      }
    };
  }, [userId]);

  const fetchNotifications = async (): Promise<Notification[]> => {
    const data = await getMyNotifications();
    setNotifications(data);
    return data;
  };

  const resetUnreadCount = () => setUnreadCount(0);

  return { notifications, unreadCount, fetchNotifications, resetUnreadCount };
}
