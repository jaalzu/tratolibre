"use client";

import { useEffect, useState, useRef } from "react";
import { getMyNotifications } from "../actions/queries/getMyNotifications";
import { getUnreadCount } from "../actions/queries/getUnreadCount";
import type { Notification } from "../types";
import type { RealtimeChannel } from "@supabase/supabase-js";

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

export function useNotificationsData({
  userId,
  initialCount,
}: UseNotificationsDataProps): UseNotificationsDataReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const setupRef = useRef(false);

  useEffect(() => {
    if (setupRef.current) return;
    setupRef.current = true;

    let mounted = true;
    let channel: RealtimeChannel | null = null;

    const setupRealtime = async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();

        const channelName = `notifications-badge-${userId}`;

        // Eliminar channels existentes
        supabase.getChannels().forEach((ch) => {
          if (ch.topic === `realtime:${channelName}`) {
            supabase.removeChannel(ch);
          }
        });

        channel = supabase
          .channel(channelName)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${userId}`,
            },
            async () => {
              if (mounted) {
                const newCount = await getUnreadCount();
                setUnreadCount(newCount);
              }
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
      mounted = false;
      setupRef.current = false; // ✅ Reset en cleanup
      if (channel) {
        channel.unsubscribe();
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
