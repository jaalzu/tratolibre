import { Box, Flex } from "@chakra-ui/react";
import { ProfileHeader } from "./header/ProfileHeader";
import { ProfileItemsTabs } from "./items/ProfileItemsTabs";
import { PendingReviewBanner } from "@/features/reviews/PendingReviewBanner";
import { Profile } from "@/features/profile/types";
import { ItemSummary } from "@/features/items/types";
import type { PendingReview } from "@/features/reviews/actions";
import { ReportButton } from "@/features/reports/components/ReportButton";

interface ProfileViewProps {
  profile: Profile;
  items: ItemSummary[];
  salesCount: number;
  purchasesCount: number;
  isOwner?: boolean;
  pendingReviews?: PendingReview[];
}

export const ProfileView = ({
  profile,
  items,
  salesCount,
  purchasesCount,
  isOwner,
  pendingReviews = [],
}: ProfileViewProps) => (
  <Box minH="100vh" bg="neutral.150" px={{ base: 4, md: 8 }}>
    <Box maxW="1200px" mx="auto">
      {/* BANNER: reseñas pendientes — solo si es owner y tiene pendientes */}
      {isOwner && pendingReviews.length > 0 && (
        <Box pt={4}>
          <PendingReviewBanner pendingReviews={pendingReviews} />
        </Box>
      )}

      {/* HEADER */}
      <Box
        bg="neutral.50"
        borderBottomLeftRadius="3xl"
        borderBottomRightRadius="3xl"
        px={{ base: 5, md: 8 }}
        pt={4}
        pb={6}
      >
        <ProfileHeader
          name={profile?.name}
          avatarUrl={profile?.avatar_url}
          location={profile?.location}
          salesCount={salesCount}
          purchasesCount={purchasesCount}
          reviewsCount={profile?.reviews_count ?? 0}
          rating={profile?.rating ?? 0}
          isOwner={isOwner}
        />
        {!isOwner && (
          <Flex justify="center" mt={4}>
            <ReportButton
              type="user"
              targetId={profile.id}
              color="accent.default"
              label="Reportar perfil"
            />
          </Flex>
        )}
      </Box>

      {/* ITEMS */}
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
