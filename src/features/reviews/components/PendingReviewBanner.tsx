"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { Star, ChevronLeft, ChevronRight } from "@boxicons/react";
import { ReviewModal } from "./ReviewModal";
import { usePendingCarousel } from "../hooks/usePendingCarousel";
import type { PendingReview } from "../types";

export function PendingReviewBanner({
  pendingReviews,
}: {
  pendingReviews: PendingReview[];
}) {
  const {
    current,
    total,
    currentReview,
    isVisible,
    isModalOpen,
    prev,
    next,
    openReview,
    closeReview,
  } = usePendingCarousel(pendingReviews);

  if (!isVisible) return null;

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
          {/* Icono Star */}
          <Flex
            align="center"
            justify="center"
            w="36px"
            h="36px"
            borderRadius="full"
            bg="brand.100"
            color="brand.default"
          >
            <Star width="18px" height="18px" fill="currentColor" />
          </Flex>

          <Box flex={1}>
            <Text fontSize="sm" fontWeight="semibold">
              {total === 1
                ? "Tenés una reseña pendiente"
                : `Reseña ${current + 1} de ${total}`}
            </Text>
            <Text fontSize="xs" color="neutral.500">
              Calificá tu experiencia con {currentReview.reviewedName}
            </Text>
          </Box>

          <Flex gap={1} align="center">
            {total > 1 && (
              <>
                <Box
                  as="button"
                  onClick={prev}
                  style={{
                    cursor: current === 0 ? "not-allowed" : "pointer",
                    opacity: current === 0 ? 0.3 : 1,
                  }}
                  {...(current === 0 ? { disabled: true } : {})}
                >
                  <ChevronLeft width="25px" height="25px" fill="currentColor" />
                </Box>

                <Box
                  as="button"
                  onClick={next} // <--- Usamos 'next' del hook
                  style={{
                    cursor: current === total - 1 ? "not-allowed" : "pointer",
                    opacity: current === total - 1 ? 0.3 : 1,
                  }}
                  {...(current === total - 1 ? { disabled: true } : {})}
                >
                  <ChevronRight
                    width="25px"
                    height="25px"
                    fill="currentColor"
                  />
                </Box>
              </>
            )}

            <Box
              as="button"
              onClick={openReview}
              px={3}
              py={1}
              borderRadius="lg"
              bg="brand.100"
              fontSize="xs"
              fontWeight="semibold"
              color="brand.default"
            >
              Calificar
            </Box>
          </Flex>
        </Flex>
      </Box>

      <ReviewModal
        open={isModalOpen}
        onClose={closeReview}
        data={{
          purchaseId: currentReview.id,
          reviewedId: currentReview.reviewedId,
          reviewedName: currentReview.reviewedName,
          itemTitle: currentReview.itemTitle,
          role: currentReview.myRole,
        }}
      />
    </>
  );
}
