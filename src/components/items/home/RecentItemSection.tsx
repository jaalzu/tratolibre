import { Box } from '@chakra-ui/react'
import { Hero } from '@/components/sections/Hero'
import { RecentItemsSection } from '@/components/items/home/RecentItemsSection'
import { NearbyItemsSection } from '@/components/items/home/NearbyItemsSection'
import { NewItemsSection } from '@/components/items/home/NewItemsSection'
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