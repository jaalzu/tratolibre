"use client";

import { useState } from "react";
import {
  Dialog,
  Portal,
  Flex,
  Text,
  Box,
  Textarea,
  Stack,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import { submitReviewAction } from "@/features/reviews/actions";
import { Star } from "@boxicons/react";
interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  purchaseId: string;
  reviewedId: string;
  reviewedName: string;
  itemTitle: string;
  role: "buyer" | "seller";
}

export function ReviewModal({
  open,
  onClose,
  purchaseId,
  reviewedId,
  reviewedName,
  itemTitle,
  role,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) return setError("Elegí una puntuación");
    setLoading(true);
    setError(null);

    const result = await submitReviewAction({
      purchase_id: purchaseId,
      reviewed_id: reviewedId,
      rating,
      comment: comment.trim() || undefined,
      role,
    });

    setLoading(false);
    if (result?.error) return setError(result.error as string);
    setSubmitted(true);
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    setError(null);
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => !e.open && !loading && handleClose()}
    >
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
                <Button w="full" p={1.5} onClick={handleClose}>
                  Listo
                </Button>
              </Flex>
            ) : (
              <Stack gap={4}>
                <Box>
                  <Dialog.Title fontSize="md" fontWeight="bold" mb={1}>
                    Calificá a {reviewedName}
                  </Dialog.Title>
                  <Text fontSize="sm" color="neutral.500">
                    {role === "buyer"
                      ? "Calificá al vendedor de"
                      : "Calificá al comprador de"}{" "}
                    <Text as="span" fontWeight="semibold" color="neutral.700">
                      {itemTitle}
                    </Text>
                  </Text>
                </Box>

                <Flex gap={1} justify="center">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = (hovered || rating) >= star;
                    return (
                      <Box
                        key={star}
                        cursor="pointer"
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(star)}
                        transition="transform 0.1s"
                        _active={{ transform: "scale(0.9)" }}
                      >
                        <Star
                          width="36px"
                          height="36px"
                          // Si tu versión usa props para solid, usá type="solid"
                          // Si no, usualmente se maneja con el componente SolidStar o el fill
                          fill={isActive ? "#ecc94b" : "#e2e8f0"}
                        />
                      </Box>
                    );
                  })}
                </Flex>

                {rating > 0 && (
                  <Text
                    textAlign="center"
                    fontSize="sm"
                    color="neutral.600"
                    mt={-2}
                  >
                    {
                      ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"][
                        rating
                      ]
                    }
                  </Text>
                )}

                <Textarea
                  placeholder="Contá tu experiencia"
                  value={comment}
                  pt={2.5}
                  pb={6}
                  pl={1.5}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={500}
                  rows={3}
                  fontSize="sm"
                  borderRadius="xl"
                  resize="none"
                />
                <Text
                  fontSize="xs"
                  color="neutral.400"
                  textAlign="right"
                  mt={-3}
                >
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
                    p={1.5}
                    flex={1}
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Ahora no
                  </Button>
                  <Button
                    flex={1}
                    p={1.5}
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
  );
}
