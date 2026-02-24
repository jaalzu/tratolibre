import { Box, Flex, Text } from '@chakra-ui/react'

const CONDITION_LABEL: Record<string, string> = {
  new: 'Nuevo',
  like_new: 'Como nuevo',
  good: 'Buen estado',
  fair: 'Estado regular',
  poor: 'Muy usado',
}

export default function ItemInfo({ item }: { item: any }) {
  return (
    <Box>
      {/* Título */}
      <Text fontSize="20px" fontWeight="bold" color="neutral.900" mb={1}>
        {item.title}
      </Text>

      {/* Estado */}
      {item.condition && (
        <Text fontSize="16px" color="neutral.400" mb={2}>
          {CONDITION_LABEL[item.condition] ?? item.condition}
        </Text>
      )}

      {/* Sold / Pausado */}
      {item.sold && (
        <Text fontSize="14px" color="neutral.500" mb={2}>Vendido</Text>
      )}
      {!item.available && !item.sold && (
        <Text fontSize="14px" color="neutral.400" mb={2}>Pausado</Text>
      )}

      {/* Precio */}
      {item.sale_price && (
        <Text fontSize="24px" fontWeight="bold" color="neutral.900" mt={1}>
          ${item.sale_price.toLocaleString('es-AR')}
        </Text>
      )}
    </Box>
  )
}