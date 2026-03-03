import { Box, Flex, Text } from '@chakra-ui/react'
import { Item } from '@/features/items/types'

export default function ItemDetails({ item }: { item: Item }) {
  return (
    <Box>
      {/* Detalles del producto */}
      {item.description && (
        <Box mb={12} mt={8}>
          <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={3} >
            Detalles del producto
          </Text>
          <Text fontSize="md" color="neutral.700" lineHeight="tall">
            {item.description}
          </Text>
        </Box>
      )}

      {/* Ubicación */}
      {(item.city || item.location) && (
        <Flex align="center" gap={1} >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#1a1a1a', flexShrink: 0 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <Text fontSize="md" color="neutral.500">
            {[item.location, item.city].filter(Boolean).join(', ')}
          </Text>
        </Flex>
      )}

      {/* Denunciar */}
     <Flex justify="center" mt={12} mb={2}>
  <a
    href="#"
    style={{
      fontSize: 'md',
      color: 'blue',
      textDecoration: 'underline',
      textAlign: 'center',
    }}
  >
    Denunciar producto
  </a>
</Flex>
    </Box>
  )
}