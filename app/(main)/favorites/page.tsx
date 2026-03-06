import { Text, SimpleGrid } from '@chakra-ui/react'
import { getUserFavorites } from '@/features/items/actions'
import { getAuthUser } from '@/lib/supabase/getAuthUser'
import { redirect } from 'next/navigation'
import { PageContainer } from '@/components/ui/PageContainer'
import { ItemCard } from '@/features/items/components/home/ItemCard'
import { Item } from '@/features/items/types'

export default async function FavoritesPage() {
  const { user } = await getAuthUser()
  if (!user) redirect('/login')

  const favorites = await getUserFavorites()

  return (
    <PageContainer maxW="700px">
      <Text fontSize="xl" fontWeight="bold" color="neutral.900" mb={6}>
        Mis favoritos
      </Text>

      {favorites.length === 0 ? (
        <Text color="neutral.400" textAlign="center" mt={12}>
          Todavía no guardaste ningún favorito
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 2, md: 3 }} gap={6}>
          {favorites.map((item: Item) => (
            <ItemCard
              key={item.id}
              obj={item}
              userId={user.id}
              initialFavorited={true}
            />
          ))}
        </SimpleGrid>
      )}
    </PageContainer>
  )
}