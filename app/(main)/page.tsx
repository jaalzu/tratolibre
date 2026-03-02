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
  setInterval(() => {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memoria usada: ${used.toFixed(2)} MB`);
}, 2000);

  return (
    <Box>
           <Hero isLoggedIn={!!session} />
      <ItemsCategorySection  title="Publicaciones recientes" items={recent} viewMoreHref="/explore" />
   
    </Box>
  )
}