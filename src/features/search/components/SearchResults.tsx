"use client";

import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import { ItemCard } from "@/features/items/components/home/ItemCard";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { FadeInGrid } from "@/shared/components/ui/FadeInGrid";
import { SearchPageParams } from "../types";
import { useSearchResults } from "../hooks/useSearchResults";
import { ActiveFilterChips } from "./ActiveFilterChips";

function SearchSkeleton() {
  return (
    <Box display="grid" gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }} gap={{ base: 3, md: 5 }}>
      {[...Array(8)].map((_, i) => (
        <Box key={i} w="full">
          <Box h="240px" bg="neutral.100" borderRadius="md" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
          <Flex justify="space-between" align="center" mt={2} mb={1}>
            <Box w="80px" h="18px" bg="neutral.100" borderRadius="md" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
            <Box w="24px" h="24px" bg="neutral.100" borderRadius="full" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
          </Flex>
          <Box w="75%" h="16px" bg="neutral.100" borderRadius="md" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
        </Box>
      ))}
      <style>{`@keyframes pulse {0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </Box>
  );
}

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
        <Box mb={2}>
          <ActiveFilterChips />
        </Box>
        <Heading as="h1" fontSize="lg" fontWeight="bold" color="neutral.900" mb={4}>
          {title}
        </Heading>
        <SearchSkeleton />
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <Box mb={2}>
        <ActiveFilterChips />
      </Box>
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
            role="status"
            aria-live="polite"
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
