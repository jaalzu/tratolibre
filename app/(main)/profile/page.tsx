import { getMyProfile } from "@/features/profile/actions";
import { getPendingReviewsAction } from "@/features/reviews/actions"; // O getPendingReviews
import { ProfileView } from "@/features/profile/components/ProfileView";
import type { PendingReview } from "@/features/reviews/types";

export default async function MyProfilePage() {
  // Promise.all infiere los tipos, pero si querés estar 100% seguro:
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
      pendingReviews={pendingReviews as PendingReview[]} // Cast por si las moscas con el Promise.all
      isOwner
    />
  );
}
