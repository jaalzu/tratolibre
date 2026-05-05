"use client";

import { Box, Flex, Text, Circle, Spinner } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import { useStartChat } from "@/features/items/hooks/useStartChat";
import { useProfile, type AuthProfile } from "@/shared/hooks/useProfile"; // ✅ Importa el tipo
import NextLink from "next/link";
import { useRouter } from "next/navigation";

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
  );
}

export default function SellerCard({
  profile,
  itemId,
  userId,
}: {
  profile: Partial<AuthProfile> | null;
  itemId?: string;
  userId?: string | null;
}) {
  const router = useRouter();
  const { startChat, loading } = useStartChat();

  const { data: activeProfile } = useProfile(profile?.id, profile);

  const currentProfile = activeProfile || profile;
  const isOwner = userId && currentProfile?.id && userId === currentProfile.id;
  const rating = currentProfile?.rating ?? 5;

  const handleChat = () => {
    if (!userId) {
      router.push("/login");
      return;
    }
    if (!itemId || !currentProfile?.id) return;
    startChat(itemId, currentProfile.id);
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={3}
      border="1px solid"
      bg="neutral.150"
      boxShadow="base"
      borderColor="neutral.900"
      borderRadius="xl"
      px={5}
      py={5}
    >
      <Flex align="center" gap={3}>
        {currentProfile?.avatar_url ? (
          <img
            src={currentProfile.avatar_url}
            alt={currentProfile?.name ?? ""}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <Circle
            size="48px"
            bg="brand.default"
            color="neutral.50"
            fontWeight="bold"
            fontSize="lg"
            flexShrink={0}
          >
            {currentProfile?.name?.[0]?.toUpperCase()}
          </Circle>
        )}

        <Box>
          <Box asChild>
            <NextLink href={`/profile/${currentProfile?.id}`}>
              <Text
                fontSize="md"
                fontWeight="bold"
                color="neutral.900"
                lineHeight="1.2"
                _hover={{ color: "brand.default" }}
                transition="color 0.15s"
              >
                {currentProfile?.name}
              </Text>
            </NextLink>
          </Box>
          <Flex align="center" gap={1} mt={0.5}>
            <StarRating rating={rating} />
            <Text fontSize="xs" color="neutral.400">
              ({currentProfile?.reviews_count ?? 0})
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
          data-testid="chat-button"
          position="relative"
        >
          <Box
            opacity={loading ? 0 : 1}
            visibility={loading ? "hidden" : "visible"}
          >
            Chat
          </Box>

          {loading && (
            <Flex position="absolute" inset={0} align="center" justify="center">
              <Spinner size="sm" color="neutral.50" />
            </Flex>
          )}
        </Button>
      )}
    </Flex>
  );
}
