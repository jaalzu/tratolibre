import { Box } from '@chakra-ui/react'
import { Hero } from '@/components/sections/Hero'
import { RecentItemsSection } from '@/features/items/components/home/RecentItemsSection'
import { NearbyItemsSection } from '@/features/items/components/home/NearbyItemsSection'
import { NewItemsSection } from '@/features/items/components/home/NewItemsSection'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <Box>
      <Hero isLoggedIn={!!user} />
      <RecentItemsSection userId={user?.id ?? null} />
      <NearbyItemsSection userId={user?.id ?? null} />
      <NewItemsSection userId={user?.id ?? null} />
    </Box>
  )
}