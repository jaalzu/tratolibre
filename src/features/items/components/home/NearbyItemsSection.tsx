import { getItems } from "@/features/items/actions";
import { getUserProvince } from "@/features/profile/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";

export async function NearbyItemsSection({
  userId,
}: {
  userId: string | null;
}) {
  if (!userId) return null;

  const province = await getUserProvince(userId);

  if (!province) return null;

  const itemsResult = await getItems({ province });

  if (!itemsResult.success) {
    console.error("Error cargando items cercanos:", itemsResult.error);
    return null;
  }

  return (
    <ItemsCategorySection
      title="Cerca tuyo"
      items={itemsResult.data.slice(0, 13)}
      viewMoreHref={`/search?province=${encodeURIComponent(province)}`}
      userId={userId}
    />
  );
}
