import { getItems, getUserFavoriteIds } from "@/features/items/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";

export async function NewItemsSection({ userId }: { userId: string | null }) {
  const [items, favoriteIds] = await Promise.all([
    getItems({ condition: "like_new" }),
    userId ? getUserFavoriteIds(userId) : Promise.resolve([]),
  ]);

  return (
    <ItemsCategorySection
      title="Artículos como nuevos"
      items={items.slice(0, 13)}
      viewMoreHref="/search?condition=like_new"
      userId={userId}
      favoriteIds={favoriteIds}
    />
  );
}
