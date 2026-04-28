import { getItems } from "@/features/items/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";

export async function NewItemsSection({ userId }: { userId: string | null }) {
  const itemsResult = await getItems({ condition: "like_new" });

  if (!itemsResult.success) {
    console.error("Error cargando items nuevos:", itemsResult.error);
    return null;
  }

  return (
    <ItemsCategorySection
      title="Artículos como nuevos"
      items={itemsResult.data.slice(0, 10)}
      viewMoreHref="/search?condition=like_new"
      userId={userId}
    />
  );
}
