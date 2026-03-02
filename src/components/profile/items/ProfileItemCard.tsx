import { Box, Text } from '@chakra-ui/react'
import Image from 'next/image'
import NextLink from 'next/link'

interface ProfileItemCardProps {
 item: {
    id: string
    title: string
    images: string[]
    sale_price: number
    sold: boolean
    city?: string
  }
}

export const ProfileItemCard = ({ item }: ProfileItemCardProps) => (
  <NextLink href={`/item/${item.id}`} style={{ textDecoration: 'none' }}>
    <Box
      borderRadius="xl"
      border="1px solid"
      borderColor="neutral.100"
      bg="white"
      overflow="hidden"
      opacity={item.sold ? 0.7 : 1}
      transition="all 0.2s"
      _hover={{ borderColor: 'neutral.200' }}
    >
      {/* Imagen */}
      <Box position="relative" w="full" paddingBottom="100%">
        {item.images?.[0] ? (
          <Image src={item.images[0]} alt={item.title} fill style={{ objectFit: 'cover' }} />
        ) : (
          <Box position="absolute" inset={0} bg="neutral.100" display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="2xl">📦</Text>
          </Box>
        )}
        {item.sold && (
          <Box position="absolute" top={2} left={2} bg="neutral.800" px={2} py={0.5} borderRadius="full">
            <Text fontSize="10px" color="white" fontWeight="bold">Vendido</Text>
          </Box>
        )}
      </Box>

      {/* Info */}
      <Box p={2}>
        <Text fontSize="xs" color="neutral.600" lineClamp={2} lineHeight="1.3" mb={1}>{item.title}</Text>
        <Text fontSize="sm" fontWeight="bold" color={item.sold ? 'neutral.400' : 'neutral.900'}>
          ${item.sale_price?.toLocaleString('es-AR')}
        </Text>
      </Box>
    </Box>
  </NextLink>
)