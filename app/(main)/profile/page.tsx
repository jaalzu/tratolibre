import { getMyProfile } from '@/features/profile/actions'
import { ProfileView } from '@/components/profile/ProfileView'

export default async function MyProfilePage() {
  const { profile, items, salesCount } = await getMyProfile()

  return (
    <ProfileView
      profile={profile}
      items={items}
      salesCount={salesCount}
      isOwner
    />
  )
}