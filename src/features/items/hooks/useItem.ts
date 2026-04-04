"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getItemById } from "@/features/items/actions";

export function useItem(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["item", id],
    queryFn: () => getItemById(id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
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
