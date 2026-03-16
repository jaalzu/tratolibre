"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getMyNotifications,
  getUnreadCount,
} from "@/features/notifications/actions";
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

export function useNotificationsData({
  userId,
  initialCount,
}: UseNotificationsDataProps): UseNotificationsDataReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialCount);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
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

    return () => {
      supabase.removeChannel(channel);
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
