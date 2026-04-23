"use client";

import { useItems } from "@/features/items/hooks/useItems";
import { ItemsCategorySection } from "./ItemsCategorySection";

export function RecentItemsSection({
  userId,
  favoriteIds,
}: {
  userId: string | null;
  favoriteIds: string[];
}) {
  const { data: items } = useItems({ order_by: "most_relevance" });

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
