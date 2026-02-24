
import NextLink from 'next/link'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { getItems } from '@/features/items/actions'
import { CATEGORIES } from '@/features/items/utils'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageContainer } from '@/components/ui/PageContainer'

export default async function HomePage() {
  const Items = await getItems()
  const recent = Items.slice(0, 6)

  return (
    <Box>
      {/* Hero - Usando neutral.50 en lugar de hardcoded verde claro */}
      <Box bg="neutral.50" py={16} px={4} textAlign="center">
        <Heading as="h1" fontSize="3xl" fontWeight="bold" color="neutral.900" mb={4}>
          Comprá y vendé objetos cerca tuyo
        </Heading>
        <Text fontSize="md" color="neutral.500" mb={8} maxW="560px" mx="auto">
          Conectamos personas que tienen objetos sin usar con quienes los necesitan. Simple, seguro y local.
        </Text>
        <Flex gap={3} justify="center">
          <Button asChild>
            <NextLink href="/explore">Explorar objetos</NextLink>
          </Button>

          <Button asChild variant="secondary">
            <NextLink href="/item/new">Publicar objeto</NextLink>
          </Button>
        </Flex>
      </Box>

      {/* Categorías */}
      <PageContainer py={8}>
        <Heading as="h2" fontSize="lg" fontWeight="bold" color="neutral.900" mb={6}>
          Categorías
        </Heading>
        {/* En mobile esto debería ser scroll horizontal o grid de 3. 7 columnas es mucho */}
        <Grid templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(7, 1fr)" }} gap={3}>
          {CATEGORIES.map(c => (
            <NextLink key={c.id} href={`/explore?category=${c.id}`} style={{ textDecoration: 'none' }}>
              <Flex
                direction="column"
                align="center"
                gap={1}
                p={3}
                borderRadius="md"
                border="1px solid"
                borderColor="neutral.100"
                textAlign="center"
                transition="all 0.2s"
                _hover={{ borderColor: 'brand.default', bg: 'neutral.50' }}
              >
                <Text fontSize="2xl">{c.icon}</Text>
                <Text fontSize="xs" fontWeight="medium" color="neutral.600">{c.label}</Text>
              </Flex>
            </NextLink>
          ))}
        </Grid>
      </PageContainer>

      {/* Últimos publicados */}
      {recent.length > 0 && (
        <PageContainer pt={0} pb={12}>
          <Flex align="center" justify="space-between" mb={6}>
            <Heading as="h2" fontSize="lg" fontWeight="bold" color="neutral.900">
              Últimos publicados
            </Heading>
            <NextLink href="/explore" style={{ textDecoration: 'none' }}>
              <Text fontSize="sm" fontWeight="bold" color="brand.default" _hover={{ color: 'brand.hover' }}>
                Ver todos
              </Text>
            </NextLink>
          </Flex>

          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            {recent.map((obj: any) => (
              <NextLink key={obj.id} href={`/item/${obj.id}`} style={{ textDecoration: 'none' }}>
                <Card p={0} overflow="hidden" _hover={{ shadow: 'base' }} transition="all 0.2s">
                  {obj.images?.[0] ? (
                    <Box as="img" src={obj.images[0]} w="100%" h="200px" ItemFit="cover" />
                  ) : (
                    <Flex w="100%" h="200px" bg="neutral.100" align="center" justify="center" fontSize="4xl">
                      📦
                    </Flex>
                  )}
                  <Box p={4}>
                    <Text fontWeight="bold" color="neutral.900" fontSize="md" lineClamp={1}>{obj.title}</Text>
                    <Text fontSize="xs" color="neutral.400" mt={1}>{obj.city}</Text>
                    {obj.sale_price && (
                      <Text fontSize="md" fontWeight="bold" color="brand.default" mt={2}>
                        ${obj.sale_price.toLocaleString('es-AR')}
                      </Text>
                    )}
                  </Box>
                </Card>
              </NextLink>
            ))}
          </Grid>
        </PageContainer>
      )}
    </Box>
  )
}