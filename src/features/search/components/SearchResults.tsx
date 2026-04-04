// features/search/components/SearchResults.tsx
"use client";

import { Box, Heading, Text, Spinner, Flex } from "@chakra-ui/react";
import { ItemCard } from "@/features/items/components/home/ItemCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeInGrid } from "@/components/ui/FadeInGrid";
import { useItems } from "@/features/items/hooks/useItems";
import { SearchPageParams } from "@/features/search/actions";
import { CATEGORIES } from "@/lib/constants";

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
  // Convertir SearchPageParams a GetItemsParams
  const itemsParams = {
    query: params.keywords,
    category: params.category,
    province: params.province,
    condition: params.condition,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    date: params.date as "today" | "week" | "month" | undefined,
    order_by: params.order_by as
      | "closest"
      | "most_relevance"
      | "price_asc"
      | "price_desc"
      | undefined,
  };

  const { data: items, isLoading } = useItems(itemsParams);

  // Calcular el título
  const categoryLabel = params.category
    ? CATEGORIES.find((c) => c.id === params.category)?.label
    : null;

  const title =
    categoryLabel ??
    (params.keywords
      ? `Resultados para "${params.keywords}"`
      : "Todos los artículos");

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
        {items && items.length > 0 && (
          <Text
            as="span"
            fontSize="sm"
            fontWeight="normal"
            color="neutral.400"
            ml={2}
          >
            ({items.length} resultados)
          </Text>
        )}
      </Heading>

      {!items || items.length === 0 ? (
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
          {items.map((item) => (
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
