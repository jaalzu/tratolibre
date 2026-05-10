"use client";

import dynamic from "next/dynamic";
import { Box, Circle } from "@chakra-ui/react";
import { Bell } from "@boxicons/react";
import { useNotificationPanel } from "../hooks/useNotificationPanel";

const NotificationsPanel = dynamic(
  () => import("./NotificationsPanel").then((mod) => mod.NotificationsPanel),
  { ssr: false },
);

interface NotificationBellProps {
  initialCount: number;
  userId: string;
}

export function NotificationBell({
  initialCount,
  userId,
}: NotificationBellProps) {
  const {
    open,
    ref,
    unreadCount,
    notifications,
    loading,
    handleOpen,
    onClose,
  } = useNotificationPanel({ userId, initialCount });

  return (
    <Box ref={ref} position="relative" display="inline-flex">
      <Box
        as="button"
        onClick={handleOpen}
        position="relative"
        cursor="pointer"
        display="inline-flex"
        py={1.5}
        px={1}
        color="neutral.50"
        aria-label={
          unreadCount > 0
            ? `Notificaciones (${unreadCount} sin leer)`
            : "Notificaciones"
        }
      >
        <Bell width="28px" height="28px" fill="currentColor" />
        {unreadCount > 0 && (
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
            {unreadCount > 9 ? "9+" : unreadCount}
          </Circle>
        )}
      </Box>

      {open && (
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          position="absolute"
          top="calc(100% + 18px)"
          right={0}
          w="420px"
          bg="neutral.50"
          borderRadius="2xl"
          boxShadow="lg"
          border="1px solid"
          borderColor="brand.100"
          zIndex={300}
          overflow="hidden"
        >
          <NotificationsPanel
            notifications={notifications}
            loading={loading}
            onClose={onClose}
          />
        </Box>
      )}

      {open && (
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          top="63px"
          left={3}
          right={3}
          bg="neutral.50"
          border="1px solid"
          borderColor="brand.100"
          borderRadius="xl"
          boxShadow="base"
          zIndex={201}
          overflow="hidden"
          maxH="80vh"
        >
          <NotificationsPanel
            notifications={notifications}
            loading={loading}
            onClose={onClose}
          />
        </Box>
      )}
    </Box>
  );
}
