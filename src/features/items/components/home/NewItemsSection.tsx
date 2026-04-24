import { getItems, getUserFavoriteIds } from "@/features/items/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";

export async function NewItemsSection({ userId }: { userId: string | null }) {
  const [itemsResult, favoriteIdsResult] = await Promise.all([
    getItems({ condition: "like_new" }),
    userId ? getUserFavoriteIds(userId) : null,
  ]);

  // ✅ Manejar error en items
  if (!itemsResult.success) {
    console.error("Error cargando items nuevos:", itemsResult.error);
    return null;
  }

  // ✅ Manejar favoritos
  const favoriteIds = favoriteIdsResult?.success ? favoriteIdsResult.data : [];

  return (
    <ItemsCategorySection
      title="Artículos como nuevos"
      items={itemsResult.data.slice(0, 10)}
      viewMoreHref="/search?condition=like_new"
      userId={userId}
      favoriteIds={favoriteIds}
    />
  );
}
