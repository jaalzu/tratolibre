"use client";

import { Box, Heading, Text, Spinner, Flex } from "@chakra-ui/react";
import { ItemCard } from "@/features/items/components/home/ItemCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeInGrid } from "@/components/ui/FadeInGrid";
import { SearchPageParams } from "../types";
import { useSearchResults } from "../hooks/useSearchResults";

interface SearchResultsProps {
  favoriteIds: string[];
  userId: string | null;
  params: SearchPageParams;
}

export function SearchResults({
  favoriteIds,
  userId,
  params,
}: SearchResultsProps) {
  // Desestructuramos con valores por defecto para que items siempre sea un array
  const { items = [], isLoading, count = 0, title } = useSearchResults(params);

  if (isLoading) {
    return (
      <Box flex={1}>
        <Flex justify="center" py={8} width="100%">
          <Spinner borderWidth="3px" color="brand.500" size="lg" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <Heading
        as="h1"
        fontSize="lg"
        fontWeight="bold"
        color="neutral.900"
        mb={4}
      >
        {title}
        {count > 0 && (
          <Text
            as="span"
            fontSize="sm"
            fontWeight="normal"
            color="neutral.400"
            ml={2}
          >
            ({count} resultados)
          </Text>
        )}
      </Heading>

      {items.length === 0 ? (
        <EmptyState
          image="/svg/no-results.svg"
          imageAlt="No hay resultados"
          title="Nada por aquí"
          description="Parece que por el momento lo que buscás no está en TratoLibre."
          actionLabel="Ver publicaciones recientes"
          actionHref="/search?order_by=closest"
        />
      ) : (
        <FadeInGrid columns={{ base: 2, md: 2, lg: 3, xl: 4 }}>
          {Array.isArray(items) &&
            items.map((item) => (
              <ItemCard
                key={item.id}
                obj={item}
                userId={userId}
                initialFavorited={favoriteIds.includes(item.id)}
              />
            ))}
        </FadeInGrid>
      )}
    </Box>
  );
}
