// features/favorites/components/FavoritesView.tsx
"use client";

import dynamic from "next/dynamic";
import { Text, Box, Skeleton, SimpleGrid } from "@chakra-ui/react";
import { PageContainer } from "@/components/ui/PageContainer";
import { Item } from "@/features/items/types";

// Dinamizamos los componentes pesados
const FadeInGrid = dynamic(
  () =>
    import("@/features/search/components/FadeInGrid").then(
      (mod) => mod.FadeInGrid,
    ),
  { loading: () => <SkeletonGrid /> },
);

const ItemCard = dynamic(() =>
  import("@/features/items/components/home/ItemCard").then(
    (mod) => mod.ItemCard,
  ),
);

const EmptyState = dynamic(
  () => import("@/components/ui/EmptyState").then((mod) => mod.EmptyState),
  { loading: () => <Skeleton h="300px" w="full" borderRadius="2xl" /> },
);

// Un pequeño componente interno para el loading del grid
const SkeletonGrid = () => (
  <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} gap={4}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton key={i} h="280px" borderRadius="2xl" />
    ))}
  </SimpleGrid>
);

interface FavoritesViewProps {
  initialFavorites: Item[];
  userId: string;
}

export function FavoritesView({
  initialFavorites,
  userId,
}: FavoritesViewProps) {
  return (
    <Box>
      <PageContainer>
        <Text fontSize="2xl" fontWeight="bold" color="neutral.900">
          Mis favoritos
        </Text>
        <Text color="neutral.500" mb={6}>
          Estos son los productos de TratoLibre que más te gustan
        </Text>

        {initialFavorites.length === 0 ? (
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
              {initialFavorites.map((item) => (
                <ItemCard
                  key={item.id}
                  obj={item}
                  userId={userId}
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
