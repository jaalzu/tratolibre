import { Box, Text } from '@chakra-ui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { ItemSummary } from '@/features/items/types'


interface ProfileItemCardProps {
  item: ItemSummary
}

export const ProfileItemCard = ({ item }: ProfileItemCardProps) => (
  <NextLink href={`/item/${item.id}`} style={{ textDecoration: 'none' }}>
    <Box opacity={item.sold ? 0.7 : 1} transition="all 0.2s">
      <Box position="relative" w="full" aspectRatio="1" bg="neutral.100" borderRadius="xl" overflow="hidden">
        {item.images?.[0] ? (
          <Image
            src={item.images[0]}
            alt={item.title}
            fill
            style={{ objectFit: 'contain' }}
          />
        ) : null}
        {item.sold && (
          <Box position="absolute" top={2} left={2} bg="neutral.800" px={2} py={0.5} borderRadius="full">
            <Text fontSize="10px" color="white" fontWeight="bold">Vendido</Text>
          </Box>
        )}
      </Box>
      <Box pt={1.5}>
        <Text fontSize="md" fontWeight="bold" color={item.sold ? 'neutral.400' : 'neutral.900'}>
          ${item.sale_price?.toLocaleString('es-AR')}
        </Text>
        <Text fontSize="md" color="neutral.600" lineClamp={1}>{item.title}</Text>
      </Box>
    </Box>
  </NextLink>
)