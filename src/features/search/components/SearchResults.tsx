import { Box,  Heading, Text } from '@chakra-ui/react'
import { ItemCard } from '@/features/items/components/home/ItemCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Item } from '@/features/items/types'
import { FadeInGrid } from '@/features/search/components/FadeInGrid'

interface SearchResultsProps {
  items:       Item[]
  favoriteIds: string[]
  title:       string
  userId:      string | null
}

export function SearchResults({ items, favoriteIds, title, userId }: SearchResultsProps) {
  return (
    <Box flex={1}>
      <Heading as="h1" fontSize="lg" fontWeight="bold" color="neutral.900" mb={4}>
        {title}
        {items.length > 0 && (
          <Text as="span" fontSize="sm" fontWeight="normal" color="neutral.400" ml={2}>
            ({items.length} resultados)
          </Text>
        )}
      </Heading>

      {items.length === 0 ? (
        <EmptyState
          image="/svg/no-results.svg"
          imageAlt="No hay resultados"
          title="Nada por aquí"
          description="Parece que por el momento lo que buscás no está en TratoLibre."
          actionLabel="Ver publicaciones recientes"
          actionHref="/search?order_by=closest"
        />
      ) : (
<FadeInGrid>
  {items.map(item => (
    <ItemCard
      key={item.id}
      obj={item}
      userId={userId}
      initialFavorited={favoriteIds.includes(item.id)}
    />
  ))}
</FadeInGrid>
      )}
    </Box>
  )
}