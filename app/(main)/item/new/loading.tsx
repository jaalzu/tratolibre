import { Box, Stack, Skeleton, SimpleGrid } from '@chakra-ui/react'
import { PageContainer } from '@/components/ui/PageContainer'
import { Card } from '@/components/ui/Card'

export default function NewItemLoading() {
  return (
    <PageContainer maxW="2xl" py="12">
      <Box mb={6}>
        <Skeleton h="8" w="40%" mb={2} />
        <Skeleton h="4" w="60%" />
      </Box>
      <Card p="6">
        <Stack gap="5">
          <Skeleton h="44px" borderRadius="lg" />
          <Skeleton h="120px" borderRadius="lg" />
          <SimpleGrid columns={2} gap={4}>
            <Skeleton h="44px" borderRadius="lg" />
            <Skeleton h="44px" borderRadius="lg" />
          </SimpleGrid>
          <Skeleton h="44px" borderRadius="lg" />
          <SimpleGrid columns={2} gap={4}>
            <Skeleton h="44px" borderRadius="lg" />
            <Skeleton h="44px" borderRadius="lg" />
          </SimpleGrid>
          <SimpleGrid columns={4} gap={2}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} aspectRatio="1" borderRadius="lg" />
            ))}
          </SimpleGrid>
          <Skeleton h="44px" borderRadius="full" />
        </Stack>
      </Card>
    </PageContainer>
  )
}