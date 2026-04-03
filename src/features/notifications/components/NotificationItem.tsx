"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  getNotificationConfig,
  type NotificationConfig,
  type NotificationPayloads,
} from "../notifications.constants";
import type { Notification, NotificationType } from "../types";
import { Star } from "@boxicons/react";

function NotificationLabel({ label }: { label: NotificationConfig["label"] }) {
  if (typeof label === "string") return <>{label}</>;
  return (
    <span>
      {label.text} {label.rating}
      <Star
        width="13px"
        height="13px"
        fill="black"
        style={{
          display: "inline-block",
          marginLeft: "2px",
          verticalAlign: "middle",
        }}
      />
    </span>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

export function NotificationItem({
  notification,
  onClose,
}: NotificationItemProps) {
  const router = useRouter();
  const cfg = getNotificationConfig(
    notification.type as NotificationType,
    notification.data as NotificationPayloads[NotificationType],
  );

  if (!cfg) return null;

  const handleClick = () => {
    onClose();
    router.push(cfg.href);
  };

  const NotificationIcon = cfg.Icon;

  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      px={4}
      py={3}
      bg={notification.read ? "neutral.50" : "brand.50"}
      borderBottom="1px solid"
      borderColor="neutral.100"
      _hover={{ bg: "neutral.50" }}
      transition="background 0.15s"
    >
      <Flex align="flex-start" gap={3}>
        <Flex
          align="center"
          justify="center"
          w="32px"
          h="32px"
          borderRadius="full"
          bg="neutral.100"
          flexShrink={0}
          color={cfg.color}
        >
          {NotificationIcon && (
            <NotificationIcon width="16px" height="16px" fill="currentColor" />
          )}
        </Flex>
        <Box flex={1}>
          <Text fontSize="sm" color="neutral.800" lineHeight="1.4">
            <NotificationLabel label={cfg.label} />
          </Text>
          <Text fontSize="xs" color="neutral.400" mt={0.5}>
            {new Date(notification.created_at).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </Box>
        {!notification.read && (
          <Box
            w="7px"
            h="7px"
            borderRadius="full"
            bg="brand.default"
            flexShrink={0}
            mt={1}
          />
        )}
      </Flex>
    </Box>
  );
}
