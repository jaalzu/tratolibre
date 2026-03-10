// features/admin/components/reports/ReportCardBadges.tsx
import { Box, Flex, Text } from '@chakra-ui/react'
import { TYPE_LABEL, STATUS_LABEL, STATUS_COLORS } from '../../constants'

export const TYPE_BG: Record<string, string> = {
  item:         'secondary.default',
  conversation: 'secondary.dark',
  user:         'accent.default',
}

interface ReportCardBadgesProps {
  type: string
  status: string
  createdAt: string
}

export function ReportCardBadges({ type, status, createdAt }: ReportCardBadgesProps) {
  return (
    <Flex justify="space-between" align="center" mb={4} flexWrap="wrap" gap={2}>
      <Flex gap={2} align="center" flexWrap="wrap">
        <Box px={2.5} py={0.5} bg={TYPE_BG[type] ?? 'brand.subtle'} borderRadius="full">
          <Text fontSize="xs" fontWeight="bold" color="white">
            {TYPE_LABEL[type] ?? type}
          </Text>
        </Box>
        <Box px={2.5} py={0.5} bg="neutral.150" borderRadius="full">
          <Text fontSize="xs" fontWeight="semibold" color={STATUS_COLORS[status]}>
            {STATUS_LABEL[status] ?? status}
          </Text>
        </Box>
      </Flex>
      <Text fontSize="xs" color="neutral.500">
        {new Date(createdAt).toLocaleDateString('es-AR', {
          day: '2-digit', month: 'short', year: 'numeric'
        })}
      </Text>
    </Flex>
  )
}