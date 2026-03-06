import { Box, Grid, Text } from '@chakra-ui/react'
import { ItemCard } from '@/features/items/components/home/ItemCard'
import { getItems } from '@/features/items/actions'

interface RelatedItemsProps {
  category:  string
  excludeId: string
  userId?:   string | null
}

export async function RelatedItems({ category, excludeId, userId = null }: RelatedItemsProps) {
  const all   = await getItems({ category })
  const items = all.filter(i => i.id !== excludeId).slice(0, 6)

  if (!items.length) return null

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" color="neutral.900" mb={4}>
        Otras personas están viendo
      </Text>
      <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4} justifyItems="start">
        {items.map(obj => (
          <ItemCard key={obj.id} obj={obj} userId={userId} />
        ))}
      </Grid>
    </Box>
  )
}