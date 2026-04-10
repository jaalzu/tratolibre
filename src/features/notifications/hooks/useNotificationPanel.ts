"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "./useNotifications";

interface UseNotificationPanelProps {
  userId: string;
  initialCount: number;
}

interface UseNotificationPanelReturn {
  open: boolean;
  ref: React.RefObject<HTMLDivElement | null>; // Agregá | null acá
  unreadCount: number;
  notifications: ReturnType<typeof useNotifications>["notifications"];
  loading: boolean;
  handleOpen: () => void;
  onClose: () => void;
}

/**
 * Hook para gestionar el panel de notificaciones (apertura, cierre, click outside)
 * @param userId - ID del usuario
 * @param initialCount - Conteo inicial de notificaciones no leídas
 * @returns Estado del panel y handlers
 */
export function useNotificationPanel({
  userId,
  initialCount,
}: UseNotificationPanelProps): UseNotificationPanelReturn {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { unreadCount, notifications, loading, fetchAndMarkRead } =
    useNotifications({
      userId,
      initialCount,
    });

  // Click outside handler
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
    if (open) {
      setOpen(false);
      return;
    }

    setOpen(true);

    if (notifications.length === 0 || unreadCount > 0) {
      await fetchAndMarkRead();
    }
  };

  const onClose = () => setOpen(false);

  return {
    open,
    ref,
    unreadCount,
    notifications,
    loading,
    handleOpen,
    onClose,
  };
}
