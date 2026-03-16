"use client";

import { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ReviewModal } from "@/features/reviews/ReviewModal";
import type { PendingReview } from "@/features/reviews/actions";

export function PendingReviewBanner({
  pendingReviews,
}: {
  pendingReviews: PendingReview[];
}) {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);

  if (!pendingReviews.length || dismissed) return null;

  const review = pendingReviews[current];
  if (!review) return null;
  const total = pendingReviews.length;
  const itemTitle =
    (review.items as { title: string } | null)?.title ?? "este artículo";

  const handleClose = () => {
    setOpen(false);
    if (current < total - 1) {
      setCurrent((c) => c + 1);
    } else {
      setDismissed(true);
    }
  };

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
            <i className="bx bx-star" style={{ fontSize: "18px" }} />
          </Flex>

          <Box flex={1}>
            <Text fontSize="sm" fontWeight="semibold" color="neutral.900">
              {total === 1
                ? "Tenés una reseña pendiente"
                : `Reseña ${current + 1} de ${total}`}
            </Text>
            <Text fontSize="xs" color="neutral.500">
              Calificá tu experiencia con {review.reviewedName ?? "el usuario"}
            </Text>
          </Box>

          <Flex gap={1} align="center">
            {/* Flechas — solo si hay más de una */}
            {total > 1 && (
              <>
                <Box
                  as="button"
                  onClick={() =>
                    current > 0 && setCurrent((c) => Math.max(0, c - 1))
                  }
                  color={current === 0 ? "neutral.200" : "neutral.500"}
                  aria-disabled={current === 0}
                  px={1}
                >
                  <i
                    className="bx bx-chevron-left"
                    style={{ fontSize: "25px" }}
                  />
                </Box>

                <Box
                  as="button"
                  onClick={() =>
                    current < total - 1 &&
                    setCurrent((c) => Math.min(total - 1, c + 1))
                  }
                  color={current === total - 1 ? "neutral.200" : "neutral.500"}
                  aria-disabled={current === total - 1}
                  px={1}
                >
                  <i
                    className="bx bx-chevron-right"
                    style={{ fontSize: "25px" }}
                  />
                </Box>
              </>
            )}

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
          </Flex>
        </Flex>
      </Box>

      <ReviewModal
        open={open}
        onClose={handleClose}
        purchaseId={review.id}
        reviewedId={review.reviewedId}
        reviewedName={review.reviewedName ?? "el usuario"}
        itemTitle={itemTitle}
        role={review.myRole as "buyer" | "seller"}
      />
    </>
  );
}
