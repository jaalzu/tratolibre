export const dynamic = "force-dynamic";

import { getMyProfile } from "@/features/profile/actions";
import { getPendingReviewsAction } from "@/features/reviews/actions";
import { ProfileView } from "@/features/profile/components/ProfileView";
import type { PendingReview } from "@/features/reviews/types";

export default async function MyProfilePage() {
  const [profileData, pendingReviews] = await Promise.all([
    getMyProfile(),
    getPendingReviewsAction(),
  ]);

  const { profile, items, salesCount, purchasesCount } = profileData;

  return (
    <ProfileView
      profile={profile}
      items={items}
      salesCount={salesCount}
      purchasesCount={purchasesCount}
      pendingReviews={pendingReviews as PendingReview[]}
      isOwner
    />
  );
}
