import { Box, Flex, Text } from "@chakra-ui/react";
import { ProfileAvatar } from "../header/ProfileAvatar";

interface ReviewCardProps {
  review: {
    rating: number;
    comment?: string;
    created_at: string;
    reviewer: {
      name: string;
      avatar_url?: string;
    };
  };
}

export const ReviewCard = ({ review }: ReviewCardProps) => (
  <Box
    p={3}
    borderRadius="xl"
    border="1px solid"
    borderColor="neutral.100"
    bg="neutral.50"
  >
    <Flex align="center" gap={2} mb={2}>
      <ProfileAvatar
        avatarUrl={review.reviewer.avatar_url}
        name={review.reviewer.name}
        size={32}
      />
      <Box flex={1}>
        <Text fontSize="sm" fontWeight="medium" color="neutral.900">
          {review.reviewer.name}
        </Text>
        <Text fontSize="xs" color="neutral.400">
          {"⭐".repeat(review.rating)} ·{" "}
          {new Date(review.created_at).toLocaleDateString("es-AR")}
        </Text>
      </Box>
    </Flex>
    {review.comment && (
      <Text fontSize="sm" color="neutral.600">
        {review.comment}
      </Text>
    )}
  </Box>
);
