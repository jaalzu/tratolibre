import { getItems } from "@/features/items/actions";
import { ItemsCategorySection } from "./ItemsCategorySection";
import { GetItemsParams } from "@/features/items/services/item-filters.service";

interface ItemsSectionProps {
  title: string;
  params: GetItemsParams;
  viewMoreHref?: string;
  userId: string | null;
  favoriteIds: string[];
  isPriority?: boolean;
}

export async function ItemsSection({
  title,
  params,
  viewMoreHref,
  userId,
  favoriteIds,
  isPriority = false,
}: ItemsSectionProps) {
  const result = await getItems(params);

  if (!result.success) {
    console.error(`Error cargando ${title}:`, result.error);
    return null;
  }

  if (result.data.length === 0) {
    return null;
  }

  return (
    <ItemsCategorySection
      title={title}
      items={result.data}
      viewMoreHref={viewMoreHref}
      userId={userId}
      favoriteIds={favoriteIds}
      isPrioritySection={isPriority}
    />
  );
}
