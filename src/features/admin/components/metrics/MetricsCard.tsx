// features/admin/components/MetricCard.tsx
import { Box, Flex, Text } from '@chakra-ui/react'

interface MetricCardProps {
  title: string
  icon: string
  primary: { label: string; value: string | number }
  secondary?: { label: string; value: string | number }
  alert?: boolean
}

export function MetricCard({ title, icon, primary, secondary, alert }: MetricCardProps) {
  return (
    <Box bg="neutral.50" borderRadius="2xl" px={6} py={5}>
      <Flex justify="space-between" align="flex-start" mb={4}>
        <Text fontSize="md" fontWeight="semibold" color="accent.default">
          {title}
        </Text>
        <Flex
          w={10} h={10}
          bg="brand.hover"
          borderRadius="lg"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <i className={`bx ${icon}`} style={{ fontSize: '18px', color: 'var(--chakra-colors-brand-100)' }} />
        </Flex>
      </Flex>

      <Text fontSize="3xl" fontWeight="bold" color={alert ? 'secondary.default' : 'neutral.700'} lineHeight="1">
        {primary.value}
      </Text>
      <Text fontSize="xs" color="neutral.500" mt={1}>{primary.label}</Text>

      {secondary && (
        <Flex align="center" gap={1} mt={3} pt={3} borderTop="2px solid" borderColor="border.subtle">
          <Text fontSize="sm" fontWeight="bold" color="brand.dark">{secondary.value}</Text>
          <Text fontSize="xs" color="neutral.600">{secondary.label}</Text>
        </Flex>
      )}
    </Box>
  )
}