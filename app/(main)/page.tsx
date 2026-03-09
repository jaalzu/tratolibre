import { Box } from '@chakra-ui/react'
import { Hero } from '@/components/sections/Hero'
import { LoggedInHero } from '@/components/sections/LoggedInHero'
import { RecentItemsSection } from '@/features/items/components/home/RecentItemsSection'
import { NearbyItemsSection } from '@/features/items/components/home/NearbyItemsSection'
import { NewItemsSection } from '@/features/items/components/home/NewItemsSection'
import { getAuthUser } from '@/lib/supabase/getAuthUser'
import { getAuthProfile } from '@/features/profile/actions'

export default async function HomePage() {
  const { user } = await getAuthUser()
  const profile = user ? await getAuthProfile() : null

  return (
    <Box>
      {profile ? (
        <LoggedInHero name={profile.name}  />
      ) : (
        <Hero isLoggedIn={false} />
      )}
      <RecentItemsSection userId={user?.id ?? null} />
      <NearbyItemsSection userId={user?.id ?? null} />
      <NewItemsSection userId={user?.id ?? null} />
    </Box>
  )
}