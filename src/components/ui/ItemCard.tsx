import NextLink from 'next/link'
import { Box, Text } from '@chakra-ui/react'

interface ItemCardProps {
  obj: any
}

export const ItemCard = ({ obj }: ItemCardProps) => {
  const imgW = { base: "161px", md: "166px", lg: "180px" }
  const imgH = { base: "195px", md: "271px", lg: "221px" }

  return (
    <NextLink href={`/item/${obj.id}`} style={{ textDecoration: 'none' }}>
      <Box
        w={imgW}
        transition="transform 0.2s ease"
        _hover={{ transform: 'translateY(-3px)' }}
      >
        {/* Imagen o placeholder del mismo tamaño */}
        <Box
          as={obj.images?.[0] ? "img" : "div"}
          src={obj.images?.[0] || undefined}
          w={imgW}
          h={imgH}
          objectFit="cover"
          borderRadius="lg"
          display="block"
          bg={obj.images?.[0] ? undefined : "neutral.100"}
        />

        {/* Texto */}
        <Box pt={1}>
          {obj.sale_price && (
            <Text fontSize="xs" fontWeight="bold" color="neutral.900">
              ${obj.sale_price.toLocaleString('es-AR')}
            </Text>
          )}
          <Text fontSize="xs" color="neutral.700" lineClamp={1}>
            {obj.title}
          </Text>
        </Box>
      </Box>
    </NextLink>
  )
}