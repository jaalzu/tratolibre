import { getMyProfile } from '@/features/profile/actions'
import { getPendingReviews } from '@/features/reviews/actions'
import { ProfileView } from '@/features/profile/components/ProfileView'

export default async function MyProfilePage() {
  const [{ profile, items, salesCount }, pendingReviews] = await Promise.all([
    getMyProfile(),
    getPendingReviews(),
  ])

  return (
    <ProfileView
      profile={profile}
      items={items}
      salesCount={salesCount}
      pendingReviews={pendingReviews}
      isOwner
    />
  )
}