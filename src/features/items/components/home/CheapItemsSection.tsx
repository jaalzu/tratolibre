import { getItems, getUserFavoriteIds } from "@/features/items/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";

export async function CheapItemsSection({ userId }: { userId: string | null }) {
  const [items, favoriteIds] = await Promise.all([
    getItems({ order_by: "price_asc" }),
    userId ? getUserFavoriteIds(userId) : Promise.resolve([]),
  ]);

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
