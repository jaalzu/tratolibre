"use client";

import { Box, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { ProfileHeader } from "./header/ProfileHeader";
import { ProfileItemsTabs } from "./items/ProfileItemsTabs";
import { Profile } from "@/features/profile/types";
import { ItemSummary } from "@/features/items/types";
import type { PendingReview } from "@/features/reviews/types";
import { useProfile } from "@/shared/hooks/useProfile";

const PendingReviewBanner = dynamic(
  () =>
    import("@/features/reviews/components/PendingReviewBanner").then(
      (mod) => mod.PendingReviewBanner,
    ),
  { ssr: false },
);

const ReportButton = dynamic(
  () =>
    import("@/features/reports/components/ReportButton").then(
      (mod) => mod.ReportButton,
    ),
  { ssr: false },
);

interface ProfileViewProps {
  profile: Profile;
  items: ItemSummary[];
  salesCount: number;
  purchasesCount: number;
  isOwner?: boolean;
  pendingReviews?: PendingReview[];
}

export const ProfileView = ({
  profile: initialProfile,
  items,
  salesCount,
  purchasesCount,
  isOwner,
  pendingReviews = [],
}: ProfileViewProps) => {
  const { data: profile } = useProfile(
    isOwner ? undefined : initialProfile.id,
    initialProfile,
  );

  const displayProfile = profile || initialProfile;
  return (
    <Box px={{ base: 4, md: 8 }}>
      <Box maxW="1200px" mx="auto">
        {isOwner && pendingReviews.length > 0 && (
          <Box pt={4}>
            <PendingReviewBanner pendingReviews={pendingReviews} />
          </Box>
        )}

        <Box
          bg="neutral.50"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          px={{ base: 5, md: 8 }}
          pt={4}
          pb={6}
        >
          <ProfileHeader
            name={displayProfile.name}
            avatarUrl={displayProfile.avatar_url}
            location={displayProfile.location}
            salesCount={salesCount}
            purchasesCount={purchasesCount}
            reviewsCount={displayProfile.reviews_count ?? 0}
            rating={displayProfile.rating ?? 0}
            isOwner={isOwner}
          />

          {displayProfile && (
            <Flex justify="center" mt={4}>
              <ReportButton
                type="user"
                targetId={displayProfile.id}
                color="accent.default"
                label="Reportar perfil"
              />
            </Flex>
          )}
        </Box>

        <Box
          mt={3}
          bg="neutral.50"
          borderRadius="3xl"
          px={{ base: 5, md: 8 }}
          pt={5}
          pb={24}
          minH="50vh"
        >
          <ProfileItemsTabs items={items} isOwner={isOwner} />
        </Box>
      </Box>
    </Box>
  );
};
