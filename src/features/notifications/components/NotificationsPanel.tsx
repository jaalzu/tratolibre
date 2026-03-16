"use client";

import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { NotificationItem } from "./NotificationItem";
import type { Notification } from "../types";

interface NotificationsPanelProps {
  notifications: Notification[];
  loading: boolean;
  onClose: () => void;
}

export function NotificationsPanel({
  notifications,
  loading,
  onClose,
}: NotificationsPanelProps) {
  return (
    <>
      <Flex
        px={4}
        py={4}
        borderBottom="1px solid"
        borderColor="neutral.100"
        align="center"
        justify="space-between"
      >
        <Text fontWeight="bold" fontSize="md" color="neutral.900">
          Notificaciones
        </Text>
        <Box
          as="button"
          onClick={onClose}
          color="feedback.error"
          _hover={{ color: "neutral.700" }}
        >
          <i className="bx bx-x" style={{ fontSize: "24px" }} />
        </Box>
      </Flex>

      <Box
        overflowY="auto"
        maxH="360px"
        flex={1}
        pb="env(safe-area-inset-bottom)"
      >
        {loading ? (
          <Flex justify="center" py={8}>
            <Text fontSize="md" color="neutral.400">
              Cargando...
            </Text>
          </Flex>
        ) : notifications.length === 0 ? (
          <Flex direction="column" align="center" py={12} gap={2}>
            <i
              className="bx bx-bell"
              style={{
                fontSize: "28px",
                color: "var(--chakra-colors-neutral-300)",
              }}
            />
            <Text fontSize="sm" color="neutral.400">
              No tenés notificaciones
            </Text>
          </Flex>
        ) : (
          <Stack gap={0}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={onClose}
              />
            ))}
          </Stack>
        )}
      </Box>
    </>
  );
}
