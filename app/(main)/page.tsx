import { Box } from '@chakra-ui/react'
import { Hero } from '@/components/sections/Hero'
import { RecentItemsSection } from '@/components/items/home/RecentItemsSection'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <Box>
      <Hero isLoggedIn={!!user} />
      <RecentItemsSection userId={user?.id ?? null} />
    </Box>
  )
}