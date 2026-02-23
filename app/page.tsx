import NextLink from 'next/link'
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { getObjects } from '@/features/objects/actions'
import { CATEGORIES } from '@/features/objects/utils'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageContainer } from '@/components/ui/PageContainer'

export default async function HomePage() {
  const objects = await getObjects()
  const recent = objects.slice(0, 6)

  return (
    <Box as="main">

      {/* Hero */}
      <Box bg="#f0fdf4" py={24} px={4} textAlign="center">
        <Heading as="h1" fontSize="3xl" fontWeight="bold" color="#0f0d0d" mb={4}>
          Comprá y vendé objetos cerca tuyo
        </Heading>
        <Text fontSize="lg" color="#958e8e" mb={8} maxW="560px" mx="auto">
          Conectamos personas que tienen objetos sin usar con quienes los necesitan. Simple, seguro y local.
        </Text>
        <Flex gap={3} justify="center">
        <Button asChild>
  <NextLink href="/explore">Explorar objetos</NextLink>
</Button>

<Button asChild variant="secondary">
  <NextLink href="/object/new">Publicar objeto</NextLink>
</Button>
        </Flex>
      </Box>

      {/* Categorías */}
      <PageContainer>
        <Heading as="h2" fontSize="xl" fontWeight="bold" color="#0f0d0d" mb={6}>
          Categorías
        </Heading>
        <Grid templateColumns="repeat(7, 1fr)" gap={3}>
          {CATEGORIES.map(c => (
            <NextLink key={c.id} href={`/explore?category=${c.id}`} style={{ textDecoration: 'none' }}>
              <Flex
                direction="column"
                align="center"
                gap={1}
                p={3}
                borderRadius="md"
                border="1px solid"
                borderColor="#e0e0e0"
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: '#22c55e', bg: '#f0fdf4' }}
              >
                <Text fontSize="2xl">{c.icon}</Text>
                <Text fontSize="xs" color="#615858">{c.label}</Text>
              </Flex>
            </NextLink>
          ))}
        </Grid>
      </PageContainer>

      {/* Últimos publicados */}
      {recent.length > 0 && (
        <PageContainer pt={0}>
          <Flex align="center" justify="space-between" mb={6}>
            <Heading as="h2" fontSize="xl" fontWeight="bold" color="#0f0d0d">
              Últimos publicados
            </Heading>
            <NextLink href="/explore" style={{ textDecoration: 'none' }}>
              <Text fontSize="sm" color="#22c55e" _hover={{ textDecoration: 'underline' }}>
                Ver todos
              </Text>
            </NextLink>
          </Flex>

          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {recent.map((obj: any) => (
              <NextLink key={obj.id} href={`/object/${obj.id}`} style={{ textDecoration: 'none' }}>
                <Card p={0} overflow="hidden" _hover={{ boxShadow: 'md' }} transition="box-shadow 0.2s" cursor="pointer">
                  {obj.images?.[0] ? (
                    <Box as="img" src={obj.images[0]} w="100%" h="192px" objectFit="cover" />
                  ) : (
                    <Flex w="100%" h="192px" bg="#fafafa" align="center" justify="center" fontSize="4xl">
                      📦
                    </Flex>
                  )}
                  <Box p={4}>
                    <Text fontWeight="bold" color="#0f0d0d">{obj.title}</Text>
                    <Text fontSize="sm" color="#958e8e" mt={1}>{obj.city}</Text>
                    {obj.sale_price && (
                      <Text fontSize="sm" fontWeight="bold" color="#22c55e" mt={2}>
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