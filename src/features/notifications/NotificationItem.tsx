'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import type { NotificationType } from './types'
import type { Notification } from './types'
import 'boxicons/css/boxicons.min.css'

// Payloads tipados por tipo
type SalePayload     = { item_title: string; item_id: string; buyer_id: string; purchase_id: string }
type PurchasePayload = { item_title: string; item_id: string; owner_id: string; purchase_id: string }
type ReviewPayload   = { rating: number; item_title: string; reviewer_id: string; purchase_id: string }

type NotificationPayloads = {
  sale_completed:     SalePayload
  purchase_completed: PurchasePayload
  review_received:    ReviewPayload
}

function getConfig<T extends NotificationType>(type: T, data: NotificationPayloads[T]) {
  switch (type) {
    case 'sale_completed': {
      const d = data as SalePayload
      return {
        icon:  <i className="bx bx-tag"          style={{ fontSize: '16px' }} />,
        color: 'var(--chakra-colors-brand-default)',
        label: `Marcaste "${d.item_title}" como vendido`,
        href:  `/item/${d.item_id}`,
      }
    }
    case 'purchase_completed': {
      const d = data as PurchasePayload
      return {
        icon:  <i className="bx bx-shopping-bag" style={{ fontSize: '16px' }} />,
        color: 'var(--chakra-colors-accent-default)',
        label: `Te marcaron como comprador de "${d.item_title}"`,
        href:  `/item/${d.item_id}`,
      }
    }
    case 'review_received': {
      const d = data as ReviewPayload
      return {
        icon:  <i className="bx bx-star"         style={{ fontSize: '16px' }} />,
        color: 'var(--chakra-colors-yellow-500)',
        label: (
          <span>
            Recibiste una reseña de {d.rating}
            <i className="bx bxs-star" style={{ fontSize: '13px', color: 'black', marginLeft: '2px', verticalAlign: 'middle' }} />
          </span>
        ),
        href: '/profile',
      }
    }
    default:
      return null
  }
}

export function NotificationItem({ n, onClose }: { n: Notification; onClose: () => void }) {
  const router = useRouter()
  const cfg = getConfig(n.type as NotificationType, n.data as NotificationPayloads[NotificationType])
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
        <Flex align="center" justify="center" w="32px" h="32px" borderRadius="full" bg="neutral.100" flexShrink={0} style={{ color: cfg.color }}>
          {cfg.icon}
        </Flex>
        <Box flex={1}>
          <Text fontSize="sm" color="neutral.800" lineHeight="1.4">{cfg.label}</Text>
          <Text fontSize="xs" color="neutral.400" mt={0.5}>
            {new Date(n.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </Text>
        </Box>
        {!n.read && <Box w="7px" h="7px" borderRadius="full" bg="brand.default" flexShrink={0} mt={1} />}
      </Flex>
    </Box>
  )
}