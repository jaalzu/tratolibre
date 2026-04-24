// features/items/components/sections/CheapItemsSection.tsx
"use client";

import { useItems } from "@/features/items/hooks/useItems";
import { ItemsCategorySection } from "./ItemsCategorySection";

export function CheapItemsSection({
  userId,
  favoriteIds,
}: {
  userId: string | null;
  favoriteIds: string[];
}) {
  const { data: items } = useItems({ order_by: "price_asc" });

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
