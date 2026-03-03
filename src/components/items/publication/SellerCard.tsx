'use client'

import { Box, Flex, Text, Circle, Spinner } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { useStartChat } from '@/features/items/useStartChat'
import { Profile } from '@/features/profile/types'

interface SellerCardProfile {
  id: string
  name: string | null
  avatar_url: string | null
  rating: number | null
  reviews_count: number | null
}

function StarRating({ rating }: { rating: number }) {
  return (
    <Flex gap="1px">
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          fontSize="md"
          color={star <= Math.round(rating) ? "#f5a623" : "neutral.200"}
        >
          ★
        </Text>
      ))}
    </Flex>
  )
}

export default function SellerCard({ profile, itemId, userId }: { 
  profile: SellerCardProfile | null
  itemId?: string
  userId?: string | null 
}) {
  const isOwner = userId && profile?.id && userId === profile.id
  const rating = profile?.rating ?? 5
  const { startChat, loading } = useStartChat()

  const handleChat = () => {
    if (!itemId || !profile?.id) return
    startChat(itemId, profile.id)
  }

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
          <img
            src={profile.avatar_url}
            alt={profile?.name ?? ''}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
        ) : (
          <Circle
            size="48px"
            bg="brand.default"
            color="white"
            fontWeight="bold"
            fontSize="lg"
            flexShrink={0}
          >
            {profile?.name?.[0]?.toUpperCase()}
          </Circle>
        )}

        <Box>
          <Text fontSize="md" fontWeight="bold" color="neutral.900" lineHeight="1.2">
            {profile?.name}
          </Text>
          <Flex align="center" gap={1} mt={0.5}>
            <StarRating rating={rating} />
            <Text fontSize="xs" color="neutral.400">
              ({profile?.reviews_count ?? 0})
            </Text>
          </Flex>
        </Box>
      </Flex>

      {itemId && !isOwner && (
     <Button
  variant="primary"
  size="md"
  py={2}
  px={6}
  flexShrink={0}
  onClick={handleChat}
  disabled={loading}
  position="relative"
>
  {/* Texto siempre ocupa espacio */}
  <Box
    opacity={loading ? 0 : 1}
    visibility={loading ? 'hidden' : 'visible'}
  >
    Chat
  </Box>

  {/* Spinner flotante centrado */}
  {loading && (
    <Flex
      position="absolute"
      inset={0}
      align="center"
      justify="center"
    >
      <Spinner size="sm" color="white" />
    </Flex>
  )}
</Button>
      )}
    </Flex>
  )
}