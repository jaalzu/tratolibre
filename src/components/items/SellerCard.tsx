import { Box, Flex, Text, Circle } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import NextLink from 'next/link'

function StarRating({ rating }: { rating: number }) {
  return (
    <Flex gap="1px">
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          fontSize="12px"
          color={star <= Math.round(rating) ? "#f5a623" : "neutral.200"}
        >
          ★
        </Text>
      ))}
    </Flex>
  )
}

export default function SellerCard({ profile, itemId }: { profile: any, itemId?: string }) {
  const rating = profile?.rating ?? 5

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={3}
      border="1px solid"
      borderColor="neutral.100"
      borderRadius="xl"
      px={4}
      h="86px"
    >
      <Flex align="center" gap={3}>
        {profile?.avatar_url ? (
          <Box
            as="img"
            src={profile.avatar_url}
            w="48px"
            h="48px"
            borderRadius="full"
            objectFit="cover"
            flexShrink={0}
          />
        ) : (
          <Circle size="48px" bg="brand.default" color="white" fontWeight="bold" fontSize="lg" flexShrink={0}>
            {profile?.name?.[0]?.toUpperCase()}
          </Circle>
        )}
        <Box>
          <Text fontSize="16px" fontWeight="bold" color="neutral.900" lineHeight="1.2">
            {profile?.name}
          </Text>
          <Flex align="center" gap={1} mt={0.5}>
            <StarRating rating={rating} />
            <Text fontSize="11px" color="neutral.400">({profile?.reviews_count ?? 0})</Text>
          </Flex>
        </Box>
      </Flex>

      {itemId && (
        <Button asChild variant="secondary" size="md" py={2} px={3}  flexShrink={0}>
          <NextLink href={`/chat?item=${itemId}`}>Chat</NextLink>
        </Button>
      )}
    </Flex>
  )
}