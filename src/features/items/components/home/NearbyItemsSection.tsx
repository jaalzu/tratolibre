import { getItems, getUserFavoriteIds } from "@/features/items/actions";
import { getUserProvince } from "@/features/profile/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";

export async function NearbyItemsSection({
  userId,
}: {
  userId: string | null;
}) {
  if (!userId) return null;

  const [province, favoriteIdsResult] = await Promise.all([
    getUserProvince(userId),
    getUserFavoriteIds(userId),
  ]);

  if (!province) return null;

  const itemsResult = await getItems({ province });

  if (!itemsResult.success) {
    console.error("Error cargando items cercanos:", itemsResult.error);
    return null;
  }

  const favoriteIds = favoriteIdsResult.success ? favoriteIdsResult.data : [];

  return (
    <ItemsCategorySection
      title="Cerca tuyo"
      items={itemsResult.data.slice(0, 13)}
      viewMoreHref={`/search?province=${encodeURIComponent(province)}`}
      userId={userId}
      favoriteIds={favoriteIds}
    />
  );
}
