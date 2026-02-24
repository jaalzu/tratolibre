import { getItemById } from '@/features/items/actions'
import { notFound } from 'next/navigation'
import ContactForm from './ContactForm'
import { createClient } from '@/lib/supabase/server'
import { Box, Flex, Heading, Text, Grid, Stack, Image, Circle } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { Card } from '@/components/ui/Card'

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const Item = await getItemById(id)
  if (!Item) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <PageContainer py={10}>
      <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={8}>

        {/* Columna izquierda — info */}
        <Box gridColumn={{ lg: "span 2" }}>
          {Item.images?.length > 0 && (
            <Flex gap={2} mb={6} overflowX="auto" scrollSnapType="x mandatory">
              {Item.images.map((url: string, i: number) => (
                <Image 
                  key={i} 
                  src={url} 
                  alt={Item.title}
                  w="full" 
                  h="64" 
                  objectFit="cover" 
                  borderRadius="xl" 
                  flexShrink={0}
                  scrollSnapAlign="start"
                />
              ))}
            </Flex>
          )}

          <Heading as="h1" fontSize="2xl" fontWeight="bold" color="neutral.900" mb={1}>
            {Item.title}
          </Heading>
          <Text color="neutral.400" fontSize="sm" mb={4}>
            {Item.location}, {Item.city}
          </Text>

          <Flex gap={3} mb={6}>
            {Item.sale_price && (
              <Card bg="brand.50" borderColor="brand.default" p={4} flex="1">
                <Text fontSize="xs" color="brand.default" fontWeight="bold" textTransform="uppercase">
                  Precio de Venta
                </Text>
                <Text fontSize="2xl" fontStyle="bold" color="brand.default">
                  ${Item.sale_price.toLocaleString('es-AR')}
                </Text>
              </Card>
            )}
          </Flex>

          <Text color="neutral.700" mb={6} lineHeight="tall">
            {Item.description}
          </Text>

          {Item.rules && (
            <Box bg="neutral.50" borderRadius="xl" p={4} mb={6}>
              <Text fontSize="sm" fontWeight="bold" color="neutral.700" mb={1}>
                Condiciones del vendedor
              </Text>
              <Text fontSize="sm" color="neutral.500">
                {Item.rules}
              </Text>
            </Box>
          )}

          <Flex align="center" gap={3} borderTop="1px solid" borderColor="neutral.100" pt={6}>
            <Circle size="10" bg="brand.default" color="white" fontWeight="bold" fontSize="lg">
              {Item.profiles?.name?.[0]?.toUpperCase()}
            </Circle>
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="neutral.900">
                {Item.profiles?.name}
              </Text>
              <Text fontSize="xs" color="neutral.400">
                ⭐ {Item.profiles?.rating || 'Sin reviews'} · {Item.profiles?.reviews_count || 0} reviews
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Columna derecha — formulario */}
        <Box gridColumn={{ lg: "span 1" }}>
          <Box position="sticky" top="24px">
            <ContactForm Item={Item} userId={user?.id ?? null} />
          </Box>
        </Box>

      </Grid>
    </PageContainer>
  )
}