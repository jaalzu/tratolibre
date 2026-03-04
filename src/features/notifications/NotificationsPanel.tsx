import { Box, Flex, Text, Stack } from '@chakra-ui/react'
import { Bell, X } from 'lucide-react'
import { NotificationItem } from './NotificationItem'
import type { Notification } from './types'

interface NotificationsPanelProps {
  notifications: Notification[]
  loading:       boolean
  onClose:       () => void
}

export function NotificationsPanel({ notifications, loading, onClose }: NotificationsPanelProps) {
  return (
    <>
      <Flex
        px={4} py={4}
        borderBottom="1px solid" borderColor="neutral.100"
        align="center" justify="space-between"
      >
        <Text fontWeight="bold" fontSize="md" color="neutral.900">Notificaciones</Text>
        <Box as="button" onClick={onClose} color="red" _hover={{ color: 'neutral.700' }}>
          <X size={24} />
        </Box>
      </Flex>

      <Box overflowY="auto" maxH="360px" flex={1} pb="env(safe-area-inset-bottom)">
        {loading ? (
          <Flex justify="center" py={8}>
            <Text fontSize="md" color="neutral.400">Cargando...</Text>
          </Flex>
        ) : notifications.length === 0 ? (
          <Flex direction="column" align="center" py={12} gap={2}>
            <Bell size={28} color="var(--chakra-colors-neutral-300)" />
            <Text fontSize="sm" color="neutral.400">No tenés notificaciones</Text>
          </Flex>
        ) : (
          <Stack gap={0}>
            {notifications.map(n => (
              <NotificationItem key={n.id} n={n} onClose={onClose} />
            ))}
          </Stack>
        )}
      </Box>
    </>
  )
}