// features/items/components/sections/CheapItemsSection.tsx
"use client";

import { useItems } from "@/features/items/hooks/useItems";
import { ItemsCategorySection } from "./ItemsCategorySection";
import { Spinner, Flex } from "@chakra-ui/react";

export function CheapItemsSection({
  userId,
  favoriteIds,
}: {
  userId: string | null;
  favoriteIds: string[];
}) {
  const { data: items, isLoading } = useItems({ order_by: "price_asc" });

  if (isLoading) {
    return (
      <Flex justify="center" py={8}>
        <Spinner borderWidth="3px" color="brand.500" size="lg" />
      </Flex>
    );
  }

  return (
    <ItemsCategorySection
      title="Los precios más bajos"
      items={items?.slice(0, 13) ?? []}
      viewMoreHref="/search?order_by=price_asc"
      viewMoreLabel="Ver más"
      userId={userId}
      favoriteIds={favoriteIds}
    />
  );
}
