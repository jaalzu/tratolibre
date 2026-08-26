import { Box, Flex, Text } from '@chakra-ui/react'
import { Item } from '@/features/items/types'
import { ReportButton } from '@/features/reports/components/ReportButton'

export default function ItemDetails({ item,userId  }: { item: Item , userId?: string | null }) {
const isOwner = item.owner_id === userId
  return (
    <Box>
      {/* Detalles del producto */}
      {item.description && (
        <Box mb={12} mt={8}>
          <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={3} >
            Detalles del producto
          </Text>
          <Text fontSize="md" color="neutral.600" lineHeight="tall">
            {item.description}
          </Text>
        </Box>
      )}

      {/* Ubicación */}
      {(item.city || item.location || item.province) && (
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="neutral.900" mb={1}>
            Ubicación
          </Text>
          <Flex align="center" gap={1}>
            <Box as="span" color="neutral.900" flexShrink={0} display="flex">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </Box>
            <Text fontSize="md" color="neutral.600">
              {[item.location, item.city, item.province].filter(Boolean).join(', ')}
            </Text>
          </Flex>
        </Box>
      )}

      {/* Reportar */}
   {!isOwner && (
        <Flex justify="center" mt={12} mb={2}>
          <ReportButton type="item" targetId={item.id} label="Reportar publicación" color="accent.default" />
        </Flex>
      )}
    </Box>
  )
}