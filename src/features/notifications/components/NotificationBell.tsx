"use client";

import { useEffect, useState, useRef } from "react";
import { Box, Circle } from "@chakra-ui/react";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getMyNotifications,
  markAllNotificationsRead,
} from "@/features/notifications/actions";
import { NotificationsPanel } from "./NotificationsPanel";
import type { Notification } from "../types";

interface NotificationBellProps {
  initialCount: number;
  userId: string;
}

export function NotificationBell({
  initialCount,
  userId,
}: NotificationBellProps) {
  const [count, setCount] = useState(initialCount);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
          const { count: newCount } = await supabase
            .from("notifications")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("read", false);
          setCount(newCount ?? 0);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = async () => {
    if (open) return setOpen(false);
    setOpen(true);
    setLoading(true);
    const data = await getMyNotifications();
    setNotifications(data);
    setLoading(false);
    if (count > 0) {
      await markAllNotificationsRead();
      setCount(0);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <Box ref={ref} position="relative" display="inline-flex">
      {/* Campana */}
      <Box
        as="button"
        onClick={handleOpen}
        position="relative"
        display="inline-flex"
        p={2}
        color="neutral.50"
        aria-label={
          count > 0 ? `Notificaciones (${count} sin leer)` : "Notificaciones"
        }
      >
        <Bell size={28} strokeWidth={1.75} />
        {count > 0 && (
          <Circle
            size="16px"
            bg="feedback.error"
            color="neutral.50"
            fontSize="9px"
            fontWeight="bold"
            position="absolute"
            top="-1px"
            right="-1px"
          >
            {count > 9 ? "9+" : count}
          </Circle>
        )}
      </Box>

      {/* Desktop dropdown */}
      {open && (
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          position="absolute"
          top="calc(100% + 8px)"
          right={0}
          w="320px"
          bg="neutral.50"
          borderRadius="2xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="neutral.100"
          zIndex={300}
          overflow="hidden"
        >
          <NotificationsPanel
            notifications={notifications}
            loading={loading}
            onClose={handleClose}
          />
        </Box>
      )}

      {/* Mobile modal */}
      {open && (
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          top="92px"
          left={3}
          right={3}
          bg="neutral.50"
          borderRadius="xl"
          boxShadow="base"
          zIndex={201}
          overflow="hidden"
          maxH="80vh"
        >
          <NotificationsPanel
            notifications={notifications}
            loading={loading}
            onClose={handleClose}
          />
        </Box>
      )}
    </Box>
  );
}
