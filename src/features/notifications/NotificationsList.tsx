'use client'

import { useEffect } from 'react'
import { Box, Flex, Text, Stack } from '@chakra-ui/react'
import { Bell, ShoppingBag, Star, Tag } from 'lucide-react'
import NextLink from 'next/link'
import { markAllNotificationsRead } from '@/features/notifications/actions'
import type { Notification } from './actions'

const CONFIG = {
  sale_completed: {
    icon:  <Tag size={18} />,
    color: 'brand.default',
    bg:    'brand.subtle',
    label: (data: Record<string, unknown>) =>
      `Marcaste "${data.item_title}" como vendido`,
  },
  purchase_completed: {
    icon:  <ShoppingBag size={18} />,
    color: 'accent.default',
    bg:    'accent.subtle',
    label: (data: Record<string, unknown>) =>
      `Te marcaron como comprador de "${data.item_title}"`,
  },
  review_received: {
    icon:  <Star size={18} />,
    color: 'feedback.warning',
    bg:    'yellow.50',
    label: (data: Record<string, unknown>) =>
      `Recibiste una reseña de ${data.rating}⭐ por "${data.item_title}"`,
  },
} as const

function NotificationItem({ notification }: { notification: Notification }) {
  const cfg = CONFIG[notification.type]
  if (!cfg) return null

  const href =
    notification.type === 'review_received'
      ? '/profile'
      : notification.data.item_id
      ? `/item/${notification.data.item_id}`
      : '/notifications'

  return (
    <Box
      as={NextLink}
      href={href}
      display="block"
      p={3}
      borderRadius="xl"
      border="1px solid"
      borderColor={notification.read ? 'neutral.100' : 'brand.200'}
      bg={notification.read ? 'white' : 'brand.50'}
      _hover={{ bg: 'neutral.50' }}
      transition="background 0.15s"
    >
      <Flex align="flex-start" gap={3}>
        <Flex
          align="center" justify="center"
          w="36px" h="36px" borderRadius="full"
          bg={cfg.bg} color={cfg.color} flexShrink={0}
        >
          {cfg.icon}
        </Flex>
        <Box flex={1}>
          <Text fontSize="sm" color="neutral.800" lineHeight="1.4">
            {cfg.label(notification.data)}
          </Text>
          <Text fontSize="xs" color="neutral.400" mt={0.5}>
            {new Date(notification.created_at).toLocaleDateString('es-AR', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </Text>
        </Box>
        {!notification.read && (
          <Box w="8px" h="8px" borderRadius="full" bg="brand.default" flexShrink={0} mt={1} />
        )}
      </Flex>
    </Box>
  )
}

export function NotificationsList({ notifications }: { notifications: Notification[] }) {
  useEffect(() => {
    // Marcar todas como leídas al abrir la página
    markAllNotificationsRead()
  }, [])

  return (
    <Box maxW="480px" mx="auto" px={4} py={6}>
      <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={4}>
        Notificaciones
      </Text>

      {notifications.length === 0 ? (
        <Flex direction="column" align="center" py={16} gap={3}>
          <Flex
            align="center" justify="center"
            w="56px" h="56px" borderRadius="full"
            bg="neutral.100" color="neutral.400"
          >
            <Bell size={24} />
          </Flex>
          <Text fontSize="sm" color="neutral.400">No tenés notificaciones</Text>
        </Flex>
      ) : (
        <Stack gap={2}>
          {notifications.map(n => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </Stack>
      )}
    </Box>
  )
}