import { Flex, Box, Text } from '@chakra-ui/react'

interface ProfileStatsProps {
  salesCount: number
  reviewsCount: number
  rating: number
}

const Stat = ({ label, value }: { label: string, value: string | number }) => (
  <Box textAlign="center">
    <Text fontWeight="bold" fontSize="lg" color="neutral.900">{value}</Text>
    <Text fontSize="xs" color="neutral.400">{label}</Text>
  </Box>
)

export const ProfileStats = ({ salesCount, reviewsCount, rating }: ProfileStatsProps) => (
  <Flex gap={6} justify="center">
    <Stat label="Ventas" value={salesCount} />
    <Stat label="Reseñas" value={reviewsCount} />
    <Stat label="Calificación" value={rating > 0 ? `${rating.toFixed(1)} ⭐` : '—'} />
  </Flex>
)