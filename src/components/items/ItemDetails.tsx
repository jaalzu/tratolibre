import { Box, Flex, Text } from '@chakra-ui/react'

export default function ItemDetails({ item }: { item: any }) {
  return (
    <Box>
      {/* Detalles del producto */}
      {item.description && (
        <Box mb={6}>
          <Text fontSize="lg" fontWeight="bold" color="neutral.900" mb={2}>
            Detalles del producto
          </Text>
          <Text fontSize="md" color="neutral.700" lineHeight="tall">
            {item.description}
          </Text>
        </Box>
      )}

      {/* Condiciones del vendedor */}
      {item.rules && (
        <Box bg="neutral.50" borderRadius="xl" p={4} mb={6}>
          <Text fontSize="sm" fontWeight="bold" color="neutral.700" mb={1}>Condiciones del vendedor</Text>
          <Text fontSize="sm" color="neutral.500">{item.rules}</Text>
        </Box>
      )}

      {/* Ubicación */}
      {(item.city || item.location) && (
        <Flex align="center" gap={2} mb={6}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#1a1a1a', flexShrink: 0 }}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <Text fontSize="md" color="neutral.500">
            {[item.location, item.city].filter(Boolean).join(', ')}
          </Text>
        </Flex>
      )}

      {/* Denunciar */}
      <Flex justify="center" mt={12} mb={2}>
        <Box
          as="a"
          href="#"
          fontSize="15px"
          color="accent.default"
          _hover={{ color: 'accent.hover' }}
          transition="color 0.2s"
          textDecoration="underline"
          textAlign="center"
        >
          Denunciar producto
        </Box>
      </Flex>
    </Box>
  )
}