"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Stack,
  Text,
  Textarea,
  Button,
  Portal,
  chakra,
  DialogRoot as Root,
  DialogBackdrop as Backdrop,
  DialogPositioner as Positioner,
  DialogContent as Content,
  DialogTitle as Title,
} from "@chakra-ui/react";
import { Star } from "@boxicons/react";
import { useReviewForm } from "../hooks/useReviewForm";
import type { ReviewModalData } from "../types";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  data: ReviewModalData;
}

export function ReviewModal({ open, onClose, data }: ReviewModalProps) {
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const {
    rating,
    setRating,
    comment,
    setComment,
    isLoading,
    error,
    handleSubmit,
    reset,
  } = useReviewForm(() => {
    setSubmitted(true);
  });

  if (!open || !data) return null;

  const { purchaseId, reviewedId, reviewedName, itemTitle, role } = data;

  const handleClose = () => {
    setSubmitted(false);
    reset();
    onClose();
  };

  const handleStarKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = Math.min(5, Math.max(1, (rating || 1) + dir));
      setRating(next);
      e.currentTarget
        .querySelector<HTMLElement>(`[data-star="${next}"]`)
        ?.focus();
    }
  };

  return (
    <Root
      open={open}
      onOpenChange={(e) => !e.open && !isLoading && handleClose()}
    >
      <Portal>
        <Backdrop />
        <Positioner>
          <Content borderRadius="2xl" p={5} maxW="360px">
            {submitted ? (
              <Flex direction="column" align="center" gap={4} py={4}>
                <Text fontSize="3xl">🎉</Text>
                <Text fontWeight="bold" fontSize="md" textAlign="center">
                  ¡Reseña enviada!
                </Text>
                  <Text fontSize="sm" color="neutral.400" textAlign="center">
                  Tu opinión ayuda a construir una comunidad de confianza.
                </Text>
                <Button w="full" p={1.5} onClick={handleClose}>
                  Listo
                </Button>
              </Flex>
            ) : (
              <Stack gap={4}>
                <Box>
                  <Title fontSize="md" fontWeight="bold" mb={1}>
                    Calificá a {reviewedName}
                  </Title>
                  <Text fontSize="sm" color="neutral.400">
                    {role === "buyer"
                      ? "Calificá al vendedor de"
                      : "Calificá al comprador de"}{" "}
                    <Text as="span" fontWeight="semibold" color="neutral.600">
                      {itemTitle}
                    </Text>
                  </Text>
                </Box>

                <Flex
                  gap={1}
                  justify="center"
                  role="radiogroup"
                  aria-label="Calificación"
                  onKeyDown={handleStarKeyDown}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = (hovered || rating) >= star;
                    return (
                      <chakra.button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={rating === star}
                        aria-label={`${star} de 5 estrellas`}
                        data-star={star}
                        cursor="pointer"
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(star)}
                        onFocus={() => setHovered(star)}
                        transition="transform 0.1s"
                        _active={{ transform: "scale(0.9)" }}
                        bg="transparent"
                        border="none"
                        p="0"
                      >
                        <Star
                          width="36px"
                          height="36px"
                          fill={isActive ? "var(--chakra-colors-secondary-default)" : "var(--chakra-colors-neutral-200)"}
                        />
                      </chakra.button>
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

                <Box>
                  <Textarea
                    placeholder="Contá tu experiencia"
                    aria-label="Contá tu experiencia"
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
                    mt={1}
                  >
                    {comment.length}/500
                  </Text>
                </Box>

                {error && (
                  <Text
                    fontSize="sm"
                    color="feedback.error"
                    textAlign="center"
                    role="alert"
                  >
                    {error}
                  </Text>
                )}

                <Flex gap={2}>
                  <Button
                    variant="ghost"
                    p={1.5}
                    flex={1}
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Ahora no
                  </Button>
                  <Button
                    flex={1}
                    bg="brand.default"
                    p={1.5}
                    onClick={() =>
                      handleSubmit({
                        purchase_id: purchaseId,
                        reviewed_id: reviewedId,
                        role,
                      })
                    }
                    loading={isLoading}
                    disabled={rating === 0}
                  >
                    Enviar
                  </Button>
                </Flex>
              </Stack>
            )}
          </Content>
        </Positioner>
      </Portal>
    </Root>
  );
}
