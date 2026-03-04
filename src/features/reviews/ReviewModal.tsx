'use client'

import { useState } from 'react'
import {
  Dialog, Portal, Flex, Text, Box, Textarea, Stack,
} from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { Star } from 'lucide-react'
import { submitReviewAction } from '@/features/reviews/actions'

interface ReviewModalProps {
  open:        boolean
  onClose:     () => void
  purchaseId:  string
  reviewedId:  string
  reviewedName: string
  role:        'buyer' | 'seller'
}

export function ReviewModal({
  open, onClose, purchaseId, reviewedId, reviewedName, role
}: ReviewModalProps) {
  const [rating,    setRating]    = useState(0)
  const [hovered,   setHovered]   = useState(0)
  const [comment,   setComment]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  const handleSubmit = async () => {
    if (rating === 0) return setError('Elegí una puntuación')
    setLoading(true)
    setError(null)

    const result = await submitReviewAction({
      purchase_id: purchaseId,
      reviewed_id: reviewedId,
      rating,
      comment:     comment.trim() || undefined,
      role,
    })

    setLoading(false)
    if (result?.error) return setError(result.error as string)
    setSubmitted(true)
  }

  const handleClose = () => {
    setRating(0)
    setComment('')
    setError(null)
    setSubmitted(false)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && !loading && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl" p={5} maxW="360px">

            {submitted ? (
              <Flex direction="column" align="center" gap={4} py={4}>
                <Text fontSize="3xl">🎉</Text>
                <Text fontWeight="bold" fontSize="md" textAlign="center">
                  ¡Reseña enviada!
                </Text>
                <Text fontSize="sm" color="neutral.500" textAlign="center">
                  Tu opinión ayuda a construir una comunidad de confianza.
                </Text>
                <Button w="full" onClick={handleClose}>Listo</Button>
              </Flex>
            ) : (
              <Stack gap={4}>
                <Box>
                  <Dialog.Title fontSize="md" fontWeight="bold" mb={1}>
                    Calificá a {reviewedName}
                  </Dialog.Title>
                  <Text fontSize="sm" color="neutral.500">
                    {role === 'buyer'
                      ? 'Como vendedor, ¿cómo fue la experiencia con el comprador?'
                      : 'Como comprador, ¿cómo fue la experiencia con el vendedor?'}
                  </Text>
                </Box>

                {/* Stars */}
                <Flex gap={1} justify="center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Box
                      key={star}
                      cursor="pointer"
                      color={(hovered || rating) >= star ? 'yellow.400' : 'neutral.200'}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      transition="color 0.1s"
                    >
                      <Star
                        size={36}
                        fill={(hovered || rating) >= star ? 'currentColor' : 'none'}
                        strokeWidth={1.5}
                      />
                    </Box>
                  ))}
                </Flex>

                {rating > 0 && (
                  <Text textAlign="center" fontSize="sm" color="neutral.600" mt={-2}>
                    {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][rating]}
                  </Text>
                )}

                {/* Comentario */}
                <Textarea
                  placeholder="Contá tu experiencia (opcional)"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  maxLength={500}
                  rows={3}
                  fontSize="sm"
                  borderRadius="xl"
                  resize="none"
                />
                <Text fontSize="xs" color="neutral.400" textAlign="right" mt={-3}>
                  {comment.length}/500
                </Text>

                {error && (
                  <Text fontSize="sm" color="feedback.error" textAlign="center">
                    {error}
                  </Text>
                )}

                <Flex gap={2}>
                  <Button
                    variant="ghost"
                    flex={1}
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Ahora no
                  </Button>
                  <Button
                    flex={1}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={rating === 0}
                  >
                    Enviar
                  </Button>
                </Flex>
              </Stack>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}