// NO "use client" ← Server Component
import { getItems } from "@/features/items/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";

export async function RecentItemsSection({
  userId,
  favoriteIds,
}: {
  userId: string | null;
  favoriteIds: string[];
}) {
  const result = await getItems({ order_by: "most_relevance", limit: 10 });

  if (!result.success) {
    console.error("Error cargando items recientes:", result.error);
    return null;
  }

  return (
    <ItemsCategorySection
      title="Publicaciones recientes"
      items={result.data}
      viewMoreHref="/search"
      userId={userId}
      favoriteIds={favoriteIds}
      isPrioritySection={true}
    />
  );
}
