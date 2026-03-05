import { ItemCard } from '@/components/items/home/ItemCard'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { SearchFilterBar } from '@/features/search/SearchFilterBar'
import { FilterPanel } from '@/features/search/FilterPanel'
import { searchItems } from '@/features/search/actions'
import { getUserFavoriteIds } from '@/features/items/actions'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import NextLink from 'next/link'

interface SearchPageProps {
  searchParams: Promise<{
    keywords?:  string
    category?:  string
    province?:  string
    date?:      string
    min_price?: string
    max_price?: string
    condition?: string
    order_by?:  string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const p = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [items, favoriteIds] = await Promise.all([
    searchItems({
      keywords:  p.keywords,
      category:  p.category,
      province:  p.province,
      date:      p.date as 'today' | 'week' | 'month' | undefined,
      min_price: p.min_price ? Number(p.min_price) : undefined,
      max_price: p.max_price ? Number(p.max_price) : undefined,
      condition: p.condition,
      order_by:  p.order_by as 'closest' | 'most_relevance' | 'price_asc' | 'price_desc' | undefined,
    }),
    user ? getUserFavoriteIds(user.id) : Promise.resolve([]),
  ])

  const categoryLabel = p.category
    ? CATEGORIES.find(c => c.id === p.category)?.label
    : null

  const title = categoryLabel
    ? categoryLabel
    : p.keywords
    ? `Resultados para "${p.keywords}"`
    : 'Todos los artículos'

  return (
    <>
      {/* Barra mobile */}
      <SearchFilterBar />

      <PageContainer pt={{ base: 4, md: 8 }} pb={24} px={{ base: 4, md: 8 }}>
        <Flex gap={8} align="flex-start">

          {/* Sidebar desktop */}
          <FilterPanel />

          {/* Contenido */}
          <Box flex={1}>
            <Heading as="h1" fontSize="lg" fontWeight="bold" color="neutral.900" mb={6}>
              {title}
              {items.length > 0 && (
                <Text as="span" fontSize="sm" fontWeight="normal" color="neutral.400" ml={2}>
                  ({items.length} resultados)
                </Text>
              )}
            </Heading>

            {items.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py={16} gap={3}>
                <Box position="relative" w="200px" h="200px">
                  <Image src="svg/no-results.svg" alt="Sin resultados" fill style={{ objectFit: 'contain' }} />
                </Box>
                <Text fontSize="lg" fontWeight="bold" color="neutral.800">Nada por aquí</Text>
                <Text fontSize="sm" color="neutral.400" textAlign="center" maxW="280px">
                  Parece que por el momento lo que buscás no está en TratoLibre. Mientras tanto, ¿por qué no echás un vistazo al resto?
                </Text>
                <Button asChild mt={2}>
                  <NextLink href="/search?order_by=closest">Ver publicaciones recientes</NextLink>
                </Button>
              </Flex>
            ) : (
              <Flex wrap="wrap" gap={6}>
                {items.map(item => (
                  <ItemCard
                    key={item.id}
                    obj={item}
                    userId={user?.id ?? null}
                    initialFavorited={favoriteIds.includes(item.id)}
                  />
                ))}
              </Flex>
            )}
          </Box>

        </Flex>
      </PageContainer>
    </>
  )
}