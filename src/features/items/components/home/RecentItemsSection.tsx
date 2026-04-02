import { getItems, getUserFavoriteIds } from "@/features/items/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";

export async function RecentItemsSection({
  userId,
}: {
  userId: string | null;
}) {
  const [items, favoriteIds] = await Promise.all([
    getItems({ order_by: "most_relevance" }),
    userId ? getUserFavoriteIds(userId) : Promise.resolve([]),
  ]);

  return (
    <ItemsCategorySection
      title="Publicaciones recientes"
      items={items.slice(0, 10)}
      viewMoreHref="/search"
      viewMoreLabel="Ver más"
      userId={userId}
      favoriteIds={favoriteIds}
      isPrioritySection={true}
    />
  );
}
