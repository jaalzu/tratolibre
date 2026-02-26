'use client'

import { useEffect, useState } from 'react'
import { Box, Grid, Text } from '@chakra-ui/react'
import { ItemCard } from '@/components/items/ItemCard'
import { getItemsByCategory } from '@/features/items/actions'

export default function RelatedItems({ category, excludeId }: { category: string, excludeId: string }) {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    getItemsByCategory(category).then(data => {
      setItems(data.filter((i: any) => i.id !== excludeId).slice(0, 6))
    })
  }, [category, excludeId])

  if (!items.length) return null

  return (
    <Box>
      <Text fontSize="18px" fontWeight="bold" color="neutral.900" mb={4}>
        Otras personas están viendo
      </Text>
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4} justifyItems="start">
        {items.map((obj: any) => (
          <ItemCard key={obj.id} obj={obj} />
        ))}
      </Grid>
    </Box>
  )
}