import { getMyProfile } from '@/features/profile/actions'
import { ProfileHeader } from '@/components/profile/header/ProfileHeader'
import { ProfileItemsTabs } from '@/components/profile/items/ProfileItemsTabs'
import { PageContainer } from '@/components/ui/PageContainer'

export default async function MyProfilePage() {
  const { profile, items, salesCount } = await getMyProfile()

  return (
    <PageContainer maxW="600px" pt={3}>
    <ProfileHeader
  name={profile?.name}
  avatarUrl={profile?.avatar_url}
  location={profile?.location}
  salesCount={salesCount}
  reviewsCount={profile?.reviews_count ?? 0}
  rating={profile?.rating ?? 0}
  isOwner
/>
<ProfileItemsTabs items={items} isOwner />

    </PageContainer>
  )
}