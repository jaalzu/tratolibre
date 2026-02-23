import { getObjectById } from '@/features/objects/actions'
import { notFound } from 'next/navigation'
import ContactForm from './ContactForm'
import { createClient } from '@/lib/supabase/server'
import { Box, Flex, Heading, Text, Grid, Stack, Image, Circle } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { Card } from '@/components/ui/Card'

export default async function ObjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const object = await getObjectById(id)
  if (!object) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <PageContainer py={10}>
      <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={8}>

        {/* Columna izquierda — info */}
        <Box gridColumn={{ lg: "span 2" }}>
          {object.images?.length > 0 && (
            <Flex gap={2} mb={6} overflowX="auto" scrollSnapType="x mandatory">
              {object.images.map((url: string, i: number) => (
                <Image 
                  key={i} 
                  src={url} 
                  alt={object.title}
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
            {object.title}
          </Heading>
          <Text color="neutral.400" fontSize="sm" mb={4}>
            {object.location}, {object.city}
          </Text>

          <Flex gap={3} mb={6}>
            {object.sale_price && (
              <Card bg="brand.50" borderColor="brand.default" p={4} flex="1">
                <Text fontSize="xs" color="brand.default" fontWeight="bold" textTransform="uppercase">
                  Precio de Venta
                </Text>
                <Text fontSize="2xl" fontStyle="bold" color="brand.default">
                  ${object.sale_price.toLocaleString('es-AR')}
                </Text>
              </Card>
            )}
          </Flex>

          <Text color="neutral.700" mb={6} lineHeight="tall">
            {object.description}
          </Text>

          {object.rules && (
            <Box bg="neutral.50" borderRadius="xl" p={4} mb={6}>
              <Text fontSize="sm" fontWeight="bold" color="neutral.700" mb={1}>
                Condiciones del vendedor
              </Text>
              <Text fontSize="sm" color="neutral.500">
                {object.rules}
              </Text>
            </Box>
          )}

          <Flex align="center" gap={3} borderTop="1px solid" borderColor="neutral.100" pt={6}>
            <Circle size="10" bg="brand.default" color="white" fontWeight="bold" fontSize="lg">
              {object.profiles?.name?.[0]?.toUpperCase()}
            </Circle>
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="neutral.900">
                {object.profiles?.name}
              </Text>
              <Text fontSize="xs" color="neutral.400">
                ⭐ {object.profiles?.rating || 'Sin reviews'} · {object.profiles?.reviews_count || 0} reviews
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Columna derecha — formulario */}
        <Box gridColumn={{ lg: "span 1" }}>
          <Box position="sticky" top="24px">
            <ContactForm object={object} userId={user?.id ?? null} />
          </Box>
        </Box>

      </Grid>
    </PageContainer>
  )
}