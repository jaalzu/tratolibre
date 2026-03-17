import { Text, Box } from "@chakra-ui/react";
import { getUserFavorites } from "@/features/items/actions";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/ui/PageContainer";
import { ItemCard } from "@/features/items/components/home/ItemCard";
import { Item } from "@/features/items/types";
import { FadeInGrid } from "@/features/search/components/FadeInGrid";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function FavoritesPage() {
  const { user } = await getAuthUser();
  if (!user) redirect("/login");

  const favorites = await getUserFavorites();

  return (
    <Box bg="neutral.150" minH="100vh">
      <PageContainer>
        <Text fontSize="2xl" fontWeight="bold" color="neutral.900">
          Mis favoritos
        </Text>
        <Text color="neutral.500" mb={6}>
          Estos son los productos de TratoLibre que más te gustan
        </Text>

        {favorites.length === 0 ? (
          <EmptyState
            image="/svg/no-results.svg"
            imageAlt="Sin favoritos"
            title="Todavía no tenés favoritos"
            description="Para guardar un producto, tocá el ícono de corazón."
            actionLabel="Explorar publicaciones"
            actionHref="/search"
          />
        ) : (
          <Box bg="neutral.50" p={4} borderRadius="2xl">
            <FadeInGrid>
              {favorites.map((item: Item) => (
                <ItemCard
                  key={item.id}
                  obj={item}
                  userId={user.id}
                  initialFavorited={true}
                />
              ))}
            </FadeInGrid>
          </Box>
        )}
      </PageContainer>
    </Box>
  );
}
