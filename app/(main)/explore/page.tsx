import { getItems } from '@/features/items/actions'
import NextLink from 'next/link'
import { CATEGORIES } from '@/lib/constants'
import { Box, Flex, Heading, Input, Text, SimpleGrid, Stack, NativeSelect } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/ui/PageContainer'
import { ItemCard } from '@/components/items/ItemCard'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string; city?: string; listing_type?: string }>
}) {
  const params = await searchParams
  const Items = await getItems(params)

  return (
    <PageContainer py={12}>
      <Heading as="h1" fontSize="2xl" fontWeight="bold" color="neutral.900" mb={6}>
        Explorar objetos
      </Heading>

      <Box as="form" mb={8}>
        <Flex wrap="wrap" gap={3}>
          <Input name="query" defaultValue={params.query} placeholder="Buscar..." maxW={{ base: "full", md: "200px" }} />
          
          <NativeSelect.Root maxW={{ base: "full", md: "200px" }}>
            <NativeSelect.Field name="category" defaultValue={params.category}>
              <option value="">Todas las categorías</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>

          <NativeSelect.Root maxW={{ base: "full", md: "200px" }}>
            <NativeSelect.Field name="listing_type" defaultValue={params.listing_type}>
              <option value="">Alquiler y venta</option>
              <option value="rent">Solo alquiler</option>
              <option value="sell">Solo venta</option>
              <option value="both">Ambos</option>
            </NativeSelect.Field>
          </NativeSelect.Root>

          <Input name="city" defaultValue={params.city} placeholder="Ciudad..." maxW={{ base: "full", md: "200px" }} />

          <Button type="submit">Buscar</Button>

          {(params.query || params.category || params.city || params.listing_type) && (
            <Button asChild variant="ghost" color="neutral.400">
              <NextLink href="/explore">Limpiar</NextLink>
            </Button>
          )}
        </Flex>
      </Box>

      {Items.length === 0 ? (
        <Stack align="center" justify="center" py={16} textAlign="center">
          <Text fontSize="4xl">🔍</Text>
          <Text fontWeight="bold" color="neutral.700">No encontramos objetos</Text>
          <Text fontSize="sm" color="neutral.400">Probá con otros filtros</Text>
        </Stack>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
          {Items.map((obj: any) => (
            <ItemCard key={obj.id} obj={obj} />
          ))}
        </SimpleGrid>
      )}
    </PageContainer>
  )
}