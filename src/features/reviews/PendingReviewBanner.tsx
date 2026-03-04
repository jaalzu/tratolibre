'use client'

import { useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Star, X } from 'lucide-react'
import { ReviewModal } from '@/features/reviews/ReviewModal'
import type { PendingReview } from '@/features/reviews/actions'

export function PendingReviewBanner({ pendingReviews }: { pendingReviews: PendingReview[] }) {
  const [current,   setCurrent]   = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const [open,      setOpen]      = useState(false)

  if (!pendingReviews.length || dismissed) return null

  const review = pendingReviews[current]

  return (
    <>
      <Box
        bg="brand.50"
        border="1px solid"
        borderColor="brand.200"
        borderRadius="2xl"
        p={4}
        mb={4}
      >
        <Flex align="center" gap={3}>
          <Flex
            align="center"
            justify="center"
            w="36px"
            h="36px"
            borderRadius="full"
            bg="brand.100"
            color="brand.default"
            flexShrink={0}
          >
            <Star size={18} />
          </Flex>
          <Box flex={1}>
            <Text fontSize="sm" fontWeight="semibold" color="neutral.900">
              Tenés {pendingReviews.length === 1 ? 'una reseña' : `${pendingReviews.length} reseñas`} pendiente
              {pendingReviews.length > 1 ? 's' : ''}
            </Text>
            <Text fontSize="xs" color="neutral.500">
              Calificá tu experiencia con &quot;{review.items?.[0]?.title ?? 'este artículo'}&quot;
            </Text>
          </Box>
          <Flex gap={2} align="center">
            <Box
              as="button"
              fontSize="xs"
              fontWeight="semibold"
              color="brand.default"
              onClick={() => setOpen(true)}
              _hover={{ opacity: 0.8 }}
              px={2}
              py={1}
              borderRadius="lg"
              bg="brand.100"
            >
              Calificar
            </Box>
            <Box
              as="button"
              color="neutral.400"
              onClick={() => setDismissed(true)}
              _hover={{ color: 'neutral.600' }}
            >
              <X size={16} />
            </Box>
          </Flex>
        </Flex>
      </Box>

      <ReviewModal
        open={open}
        onClose={() => {
          setOpen(false)
          if (current < pendingReviews.length - 1) {
            setCurrent(c => c + 1)
          } else {
            setDismissed(true)
          }
        }}
        purchaseId={review.id}
        reviewedId={review.reviewedId}
        reviewedName={review.reviewedName ?? 'el usuario'}
        role={review.myRole as 'buyer' | 'seller'}
      />
    </>
  )
}