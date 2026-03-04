'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { ShoppingBag, Star, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Notification } from './actions'

type NotificationType = 'sale_completed' | 'purchase_completed' | 'review_received'

function getConfig(type: NotificationType, data: Record<string, unknown>) {
  switch (type) {
    case 'sale_completed':
      return {
        icon:  <Tag size={16} />,
        color: 'var(--chakra-colors-brand-default)',
        label: `Marcaste "${data.item_title}" como vendido`,
        href:  `/item/${data.item_id}`,
      }
    case 'purchase_completed':
      return {
        icon:  <ShoppingBag size={16} />,
        color: 'var(--chakra-colors-accent-default)',
        label: `Te marcaron como comprador de "${data.item_title}"`,
        href:  `/item/${data.item_id}`,
      }
    case 'review_received':
      return {
        icon:  <Star size={16} />,
        color: 'var(--chakra-colors-yellow-500)',
        label: `Recibiste una reseña de ${data.rating}⭐`,
        href:  '/profile',
      }
  }
}

export function NotificationItem({ n, onClose }: { n: Notification; onClose: () => void }) {
  const router = useRouter()
  const cfg = getConfig(n.type as NotificationType, n.data)
  if (!cfg) return null

  const handleClick = () => {
  router.push(cfg.href as string)
  setTimeout(() => onClose(), 100)
}

  return (
    <Box
      onClick={handleClick}
      cursor="pointer"
      px={4} py={3}
      bg={n.read ? 'white' : 'brand.50'}
      borderBottom="1px solid"
      borderColor="neutral.100"
      _hover={{ bg: 'neutral.50' }}
      transition="background 0.15s"
    >
      <Flex align="flex-start" gap={3}>
        <Flex
          align="center" justify="center"
          w="32px" h="32px" borderRadius="full"
          bg="neutral.100" flexShrink={0}
          style={{ color: cfg.color }}
        >
          {cfg.icon}
        </Flex>
        <Box flex={1}>
          <Text fontSize="sm" color="neutral.800" lineHeight="1.4">
            {cfg.label}
          </Text>
          <Text fontSize="xs" color="neutral.400" mt={0.5}>
            {new Date(n.created_at).toLocaleDateString('es-AR', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </Text>
        </Box>
        {!n.read && (
          <Box w="7px" h="7px" borderRadius="full" bg="brand.default" flexShrink={0} mt={1} />
        )}
      </Flex>
    </Box>
  )
}