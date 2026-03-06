import { Box } from '@chakra-ui/react'
import { Hero } from '@/components/sections/Hero'
import { RecentItemsSection } from '@/features/items/components/home/RecentItemsSection'
import { NearbyItemsSection } from '@/features/items/components/home/NearbyItemsSection'
import { NewItemsSection } from '@/features/items/components/home/NewItemsSection'
import { getAuthUser } from '@/lib/supabase/getAuthUser'

export default async function HomePage() {
  const { user } = await getAuthUser()

  return (
    <Box>
      <Hero isLoggedIn={!!user} />
      <RecentItemsSection userId={user?.id ?? null} />
      <NearbyItemsSection userId={user?.id ?? null} />
      <NewItemsSection userId={user?.id ?? null} />
    </Box>
  )
}