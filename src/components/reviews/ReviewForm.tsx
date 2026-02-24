'use client'

import { useActionState, useState } from 'react'
import { createReviewAction } from '@/features/reviews/actions'
import { Box, Flex, Text, Textarea, Stack, chakra } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function ReviewForm({ Item, userId }: { Item: any, userId: string }) {
  const [state, formAction] = useActionState<any, FormData>(createReviewAction, null)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  const isSeller = Item.owner_id === userId
  const reviewedId = isSeller ? Item.buyer_id : Item.owner_id
  const role = isSeller ? 'seller_to_buyer' : 'buyer_to_seller'

  if (state?.success) {
    return (
      <Box 
        bg="feedback.success" 
        color="white" 
        p="4" 
        borderRadius="xl" 
        fontSize="sm" 
        fontWeight="bold"
      >
        ✓ ¡Review enviada, gracias!
      </Box>
    )
  }

  return (
    <Card p="4" borderColor="neutral.100">
      {/* Usamos el tag form nativo o chakra.form dentro de la Card */}
      <form action={formAction}>
        <Stack gap="3">
          <Text fontSize="sm" fontWeight="bold" color="neutral.700">
            Dejar una reseña
          </Text>

          <input type="hidden" name="Item_id" value={Item.id} />
          <input type="hidden" name="reviewed_id" value={reviewedId} />
          <input type="hidden" name="role" value={role} />
          <input type="hidden" name="rating" value={rating} />

          {/* Estrellas */}
          <Flex gap="1">
            {[1, 2, 3, 4, 5].map((star) => (
              <chakra.button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                fontSize="2xl"
                transition="transform 0.1s"
                _hover={{ scale: "1.15" }}
                _active={{ scale: "0.9" }}
              >
                {star <= (hover || rating) ? '⭐' : '☆'}
              </chakra.button>
            ))}
          </Flex>

          <Textarea
            name="comment"
            rows={2}
            placeholder="Contá cómo fue el trato..."
            bg="white"
            fontSize="sm"
            borderColor="neutral.200"
            borderRadius="md"
            _focus={{ 
              borderColor: "brand.default", 
              boxShadow: "focus" 
            }}
          />

          {state?.error && typeof state.error === 'string' && (
            <Text color="feedback.error" fontSize="xs" fontWeight="bold">
              {state.error}
            </Text>
          )}

          <Button
            type="submit"
            disabled={rating === 0}
            width="full"
            size="sm"
            mt="1"
          >
            Enviar review
          </Button>
        </Stack>
      </form>
    </Card>
  )
}