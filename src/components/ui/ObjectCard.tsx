import NextLink from 'next/link'
import { Box, Flex, Text, Stack } from '@chakra-ui/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ObjectCardProps {
  obj: any
}

export const ObjectCard = ({ obj }: ObjectCardProps) => {
  return (
    <Card p={0} overflow="hidden" _hover={{ shadow: "md", borderColor: "brand.default" }} transition="all 0.2s">
      <Flex direction={{ base: "column", md: "row" }}>
        
        {/* FOTO Y DESCRIPCIÓN */}
        <Box w={{ base: "100%", md: "300px" }} borderRight={{ md: "1px solid" }} borderColor="neutral.100">
          <NextLink href={`/object/${obj.id}`}>
            {obj.images?.[0] ? (
              <Box as="img" src={obj.images[0]} w="100%" h="200px" objectFit="cover" />
            ) : (
              <Flex w="100%" h="200px" bg="neutral.50" align="center" justify="center" fontSize="4xl">📦</Flex>
            )}
          </NextLink>
          
          <Box p={4}>
            <Text fontSize="xs" color="neutral.500" lineClamp={2} mb={3}>
              {obj.description || "Sin descripción disponible."}
            </Text>
            <Flex align="center" gap={1}>
              <Text fontSize="xs" fontWeight="bold" color="neutral.800">⭐ {obj.profiles?.rating || '5.0'}</Text>
              <Text fontSize="xs" color="neutral.400">({obj.profiles?.name})</Text>
            </Flex>
          </Box>
        </Box>

        {/* INFO Y ACCIONES (COMPRA/VENTA) */}
        <Flex flex="1" p={5} direction="column" justify="space-between">
          <Flex justify="space-between" align="start" wrap="wrap" gap={4}>
            <Stack gap={1}>
              <Text fontSize="xl" fontWeight="bold" color="neutral.900" lineClamp={1}>
                {obj.title}
              </Text>
              <Text fontSize="sm" color="neutral.400">{obj.city}</Text>
            </Stack>
            
            <Box textAlign={{ base: "left", md: "right" }}>
              {obj.sale_price && (
                <Text fontSize="2xl" fontWeight="bold" color="brand.default">
                  ${obj.sale_price.toLocaleString('es-AR')}
                </Text>
              )}
            </Box>
          </Flex>

          <Flex gap={3} mt={6}>
  <Button asChild flex="1">
    <NextLink href={`/object/${obj.id}`}>Ver objeto</NextLink>
  </Button>
</Flex>
        </Flex>

      </Flex>
    </Card>
  )
}