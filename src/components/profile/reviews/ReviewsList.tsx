import { Stack, Text, Flex } from '@chakra-ui/react'
import { ReviewCard } from './ReviewCard'

export const ReviewsList = ({ reviews }: { reviews: any[] }) => {
  if (!reviews.length) return (
    <Flex direction="column" align="center" py={8} gap={2}>
      <Text fontSize="2xl">⭐</Text>
      <Text fontSize="sm" color="neutral.400">Sin reseñas todavía</Text>
    </Flex>
  )

  return (
    <Stack gap={2}>
      {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
    </Stack>
  )
}