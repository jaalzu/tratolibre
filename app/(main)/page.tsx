import { Box } from '@chakra-ui/react'
import { getItems } from '@/features/items/actions'
import { Hero } from '@/components/sections/Hero'
import { ItemsCategorySection  } from '@/components/items/ItemsCategorySection'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
   const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const items = await getItems()
  const recent = items.slice(0, 13)

  return (
    <Box>
           <Hero isLoggedIn={!!session} />
      <ItemsCategorySection  title="Publicaciones recientes" items={recent} viewMoreHref="/explore" />
    </Box>
  )
}