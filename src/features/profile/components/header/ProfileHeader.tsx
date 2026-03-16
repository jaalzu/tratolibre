import { Box, Flex, Text } from "@chakra-ui/react";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileStats } from "./ProfileStats";
import NextLink from "next/link";

interface ProfileHeaderProps {
  name?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  salesCount: number;
  reviewsCount: number;
  rating: number;
  isOwner?: boolean;
}

export const ProfileHeader = ({
  name,
  avatarUrl,
  location,
  salesCount,
  reviewsCount,
  rating,
  isOwner,
}: ProfileHeaderProps) => (
  <Box pt={3} pb={4} px={2}>
    {/* Mobile */}
    <Box display={{ base: "block", md: "none" }}>
      <Flex justify="space-between" align="flex-start" mb={4}>
        <Box flex={1} pr={4}>
          <Text
            fontWeight="bold"
            fontSize="2xl"
            color="neutral.900"
            lineHeight="1.2"
            mb={1}
          >
            {name ?? "Sin nombre"}
          </Text>
          <Flex align="center" gap={1}>
            <Text fontSize="sm" color="neutral.900">
              {"★".repeat(Math.round(rating))}
              {"☆".repeat(5 - Math.round(rating))}
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="neutral.900">
              {rating > 0 ? rating.toFixed(1) : ""}
            </Text>
            <Text fontSize="xs" color="neutral.400">
              ({reviewsCount})
            </Text>
          </Flex>
        </Box>
        <Flex direction="column" align="center" gap={1}>
          <ProfileAvatar avatarUrl={avatarUrl} name={name} size={72} />
          {isOwner && (
            <NextLink href="/profile/edit">
              <Text
                fontSize="sm"
                color="accent.default"
                fontWeight="medium"
                cursor="pointer"
              >
                Editar perfil
              </Text>
            </NextLink>
          )}
        </Flex>
      </Flex>

      <ProfileStats salesCount={salesCount} isOwner={isOwner} />
      {location && (
        <Flex align="center" gap={1} mt={3}>
          <i
            className="bx bx-current-location"
            style={{
              fontSize: "16px",
              color: "var(--chakra-colors-neutral-400)",
            }}
          />
          <Text fontSize="md" color="neutral.700">
            {location}
          </Text>
        </Flex>
      )}
    </Box>

    {/* Desktop */}
    <Box display={{ base: "none", md: "block" }}>
      <Flex justify="space-between" align="center" gap={4}>
        <Flex align="center" gap={3}>
          <ProfileAvatar avatarUrl={avatarUrl} name={name} size={72} />
          <Box>
            <Text
              fontWeight="bold"
              fontSize="2xl"
              color="neutral.900"
              lineHeight="1.2"
              mb={1}
            >
              {name ?? "Sin nombre"}
            </Text>
            <Flex align="center" gap={1}>
              <Text fontSize="sm" color="neutral.900">
                {"★".repeat(Math.round(rating))}
                {"☆".repeat(5 - Math.round(rating))}
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="neutral.900">
                {rating > 0 ? rating.toFixed(1) : ""}
              </Text>
              <Text fontSize="xs" color="neutral.400">
                ({reviewsCount})
              </Text>
            </Flex>
            {isOwner && (
              <NextLink href="/profile/edit">
                <Text
                  fontSize="sm"
                  color="accent.default"
                  fontWeight="medium"
                  cursor="pointer"
                  mt={1}
                >
                  Editar perfil
                </Text>
              </NextLink>
            )}
          </Box>
        </Flex>
        <Flex direction="column" align="flex-end" gap={2}>
          <ProfileStats salesCount={salesCount} isOwner={isOwner} />{" "}
          {location && (
            <Flex align="center" gap={1}>
              <i
                className="bx bx-current-location"
                style={{
                  fontSize: "16px",
                  color: "var(--chakra-colors-neutral-400)",
                }}
              />
              <Text fontSize="md" color="neutral.700">
                {location}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  </Box>
);
