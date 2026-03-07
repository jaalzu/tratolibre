import NextLink from 'next/link'
import { Box, Flex, Text } from '@chakra-ui/react'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { Item } from '@/features/items/types'

interface ItemCardProps {
  obj: Item
  userId?: string | null
    initialFavorited?: boolean

}
export const ItemCard = ({ obj, userId = null, initialFavorited = false }: ItemCardProps) => {
  return (
    <NextLink href={`/item/${obj.id}`} style={{ textDecoration: 'none' }}>
      <Box
        w="full"
        transition="transform 0.2s ease"
        _hover={{ transform: 'translateY(-3px)' }}
      >
        {obj.images?.[0] ? (
          <img
            src={obj.images[0]}
            style={{ 
              width: '100%',
              height: '245px', 
              objectFit: 'cover', 
              borderRadius: '8px',
              display: 'block',
            }}
            alt={obj.title}
          />
        ) : (
          <Box w="full" h="245px" borderRadius="lg" bg="neutral.100" />
        )}

        <Box pt={2}>
          <Flex justify="space-between" align="center">
            {obj.sale_price && (
              <Text fontSize="md" fontWeight="bold" color="neutral.900">
                ${obj.sale_price.toLocaleString('es-AR')}
              </Text>
            )}
            <FavoriteButton itemId={obj.id} initialFavorited={initialFavorited} userId={userId} />
          </Flex>
          <Text fontSize="md" color="neutral.700" lineClamp={1}>
            {obj.title}
          </Text>
        </Box>
      </Box>
    </NextLink>
  )
}