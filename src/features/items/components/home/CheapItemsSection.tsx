// CheapItemsSection.tsx
import { getItems } from "@/features/items/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";

export async function CheapItemsSection({
  userId,
  favoriteIds,
}: {
  userId: string | null;
  favoriteIds: string[];
}) {
  const items = await getItems({ order_by: "price_asc" });

  return (
    <ItemsCategorySection
      title="Los precios más bajos"
      items={items.slice(0, 13)}
      viewMoreHref="/search?order_by=price_asc"
      viewMoreLabel="Ver más"
      userId={userId}
      favoriteIds={favoriteIds}
    />
  );
}
