import { getMyProfile } from "@/features/profile/actions";
import { getPendingReviews } from "@/features/reviews/actions";
import { ProfileView } from "@/features/profile/components/ProfileView";

export default async function MyProfilePage() {
  const [{ profile, items, salesCount, purchasesCount }, pendingReviews] =
    await Promise.all([getMyProfile(), getPendingReviews()]);

  return (
    <ProfileView
      profile={profile}
      items={items}
      salesCount={salesCount}
      purchasesCount={purchasesCount}
      pendingReviews={pendingReviews}
      isOwner
    />
  );
}
