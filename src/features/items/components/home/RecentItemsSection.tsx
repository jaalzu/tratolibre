import { getItems } from "@/features/items/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";
export async function RecentItemsSection({
  userId,
  favoriteIds,
}: {
  userId: string | null;
  favoriteIds: string[];
}) {
  const items = await getItems({ order_by: "most_relevance" });

  return (
    <ItemsCategorySection
      title="Publicaciones recientes"
      items={items.slice(0, 10)}
      viewMoreHref="/search"
      userId={userId}
      favoriteIds={favoriteIds}
      isPrioritySection={true}
    />
  );
}
