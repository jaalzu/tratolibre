import { Text, SimpleGrid, Box } from '@chakra-ui/react'
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
    <Box bg="neutral.150" minH="100vh">
      <PageContainer maxW="1300px">
        <Text fontSize="2xl" fontWeight="bold" color="neutral.900">
          Mis favoritos
        </Text>

        <Text color="neutral.500" mb={6}>
          Estos son los productos de Tratolibre que más te gustan
        </Text>

        {favorites.length === 0 ? (
          <Text color="neutral.400" textAlign="center" mt={12} mb={10}>
            Para guardar un producto, pulsa el icono de producto favorito
          </Text>
        ) : (
          <Box bg="neutral.50" p={8} borderRadius="2xl" minH="600px">
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
              {favorites.map((item: Item) => (
                <ItemCard
                  key={item.id}
                  obj={item}
                  userId={user.id}
                  initialFavorited={true}
                />
              ))}
            </SimpleGrid>
          </Box>
        )}
      </PageContainer>
    </Box>
  )
}