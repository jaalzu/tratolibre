import NextLink from 'next/link'
import { Box, Text } from '@chakra-ui/react'

interface ItemCardProps {
  obj: any
}

export const ItemCard = ({ obj }: ItemCardProps) => {
  const imgW = "186px"
  const imgH = { base: "195px", md: "241px" }

  return (
    <NextLink href={`/item/${obj.id}`} style={{ textDecoration: 'none' }}>
      <Box
        w={imgW}
        transition="transform 0.2s ease"
        _hover={{ transform: 'translateY(-3px)' }}
      >
        {obj.images?.[0] ? (
  <img
    src={obj.images[0]}
    width={imgW}
    style={{ 
      height: '225px', 
      objectFit: 'cover', 
      borderRadius: '6px',
      display: 'block',
      width: imgW
    }}
    alt={obj.title}
  />
) : (
  <Box w={imgW} h={imgH} borderRadius="lg" bg="neutral.100" />
)}

        <Box pt={2}>
          {obj.sale_price && (
            <Text fontSize="md" fontWeight="bold" color="neutral.900">
              ${obj.sale_price.toLocaleString('es-AR')}
            </Text>
          )}
          <Text fontSize="md" color="neutral.700" lineClamp={1}>
            {obj.title}
          </Text>
        </Box>
      </Box>
    </NextLink>
  )
}