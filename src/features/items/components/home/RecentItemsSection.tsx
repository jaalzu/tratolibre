"use client";

import { useItems } from "@/features/items/hooks/useItems";
import { ItemsCategorySection } from "./ItemsCategorySection";

export function RecentItemsSection({
  userId,
  favoriteIds,
}: {
  userId: string | null;
  favoriteIds: string[];
}) {
  const {
    data: items,
    error,
    isError,
    isLoading,
  } = useItems({ order_by: "most_relevance" });

  // Verificar si items tiene la estructura de Result
  if (items && typeof items === "object" && "success" in items) {
    console.error(
      "❌ ERROR: items todavía es un Result, no está desempaquetado!",
    );
  }

  if (isError) {
    console.error("Error cargando items recientes:", error);
    return null;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <ItemsCategorySection
      title="Publicaciones recientes"
      items={items?.slice(0, 10) ?? []}
      viewMoreHref="/search"
      userId={userId}
      favoriteIds={favoriteIds}
      isPrioritySection={true}
    />
  );
}
