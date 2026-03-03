import { getUserProfile } from '@/features/profile/actions'
import { ProfileView } from '@/components/profile/ProfileView'
import { notFound } from 'next/navigation'

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getUserProfile(id)
  if (!data) notFound()

  return (
    <ProfileView
      profile={data.profile}
      items={data.items}
      salesCount={data.salesCount}
      isOwner={false}
    />
  )
}