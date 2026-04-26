// NO "use client" ← Server Component
import { getItems } from "@/features/items/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";

export async function CheapItemsSection({
  userId,
  favoriteIds,
}: {
  userId: string | null;
  favoriteIds: string[];
}) {
  const result = await getItems({ order_by: "price_asc", limit: 13 });

  if (!result.success) {
    console.error("Error cargando items baratos:", result.error);
    return null;
  }

  return (
    <ItemsCategorySection
      title="Los precios más bajos"
      items={result.data}
      viewMoreHref="/search?order_by=price_asc"
      viewMoreLabel="Ver más"
      userId={userId}
      favoriteIds={favoriteIds}
    />
  );
}
