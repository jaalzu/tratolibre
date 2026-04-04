// features/items/components/sections/RecentItemsSection.tsx
"use client";

import { useItems } from "@/features/items/hooks/useItems";
import { ItemsCategorySection } from "./ItemsCategorySection";
import { Spinner, Flex } from "@chakra-ui/react";

export function RecentItemsSection({
  userId,
  favoriteIds,
}: {
  userId: string | null;
  favoriteIds: string[];
}) {
  const { data: items, isLoading } = useItems({ order_by: "most_relevance" });

  if (isLoading) {
    return (
      <Flex justify="center" py={8}>
        <Spinner borderWidth="3px" color="brand.500" size="lg" />
      </Flex>
    );
  }

  return (
    <ItemsCategorySection
      title="Publicaciones recientes"
      items={items?.slice(0, 10) ?? []}
      viewMoreHref="/search"
      userId={userId}
      favoriteIds={favoriteIds}
      isPrioritySection={true}
    />
  );
}
