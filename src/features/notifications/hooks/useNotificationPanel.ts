"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "./useNotifications";

interface UseNotificationPanelProps {
  userId: string;
  initialCount: number;
}

export function useNotificationPanel({
  userId,
  initialCount,
}: UseNotificationPanelProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { unreadCount, notifications, loading, fetchAndMarkRead } =
    useNotifications({
      userId,
      initialCount,
    });

  // Click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = async () => {
    if (open) return setOpen(false);
    setOpen(true);
    await fetchAndMarkRead();
  };

  return {
    open,
    ref,
    unreadCount,
    notifications,
    loading,
    handleOpen,
    onClose: () => setOpen(false),
  };
}
