"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getItemById } from "@/features/items/actions";

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

export function useItem(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["item", id],
    queryFn: () => getItemById(id),
    enabled: !!id, // solo fetch si hay id
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    initialData: () => {
      const allItemsQueries = queryClient.getQueriesData<any[]>({
        queryKey: ["items"],
      });

      for (const [, data] of allItemsQueries) {
        if (!data) continue;
        const item = data.find((item) => item.id === id);
        if (item) return item;
      }

      return undefined;
    },
  });
}
