// shared/hooks/useItem.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getItemById } from "@/features/items/actions";
import type { ItemWithProfile } from "@/features/items/types";

export function useItem(itemId: string, initialData?: ItemWithProfile | null) {
  return useQuery<ItemWithProfile | null>({
    queryKey: ["item", itemId],
    queryFn: async () => {
      const result = await getItemById(itemId);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    enabled: !!itemId,
    initialData: initialData ?? undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
