import NextLink from 'next/link'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { getItems } from '@/features/items/actions'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/ui/PageContainer'
import { ItemCard } from '@/components/ui/ItemCard'

export default async function HomePage() {
  const items = await getItems()
  const recent = items.slice(0, 6)

  return (
    <Box>
      {/* Hero */}
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

      

      {/* Últimos publicados */}
      {recent.length > 0 && (
       <PageContainer pt={{ base: 4, md: 8 }} pb={12} px={{ base: 4, md: 24 }}>
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

          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={6} justifyItems="start">
            {recent.map((obj: any) => (
              <ItemCard key={obj.id} obj={obj} />
            ))}
          </Grid>
        </PageContainer>
      )}
    </Box>
  )
}