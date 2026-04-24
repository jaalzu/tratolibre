import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getItems } from "@/features/items/services/items-service";
import { createClient } from "@/lib/supabase/server";
import { SearchPageParams } from "./types";
import { ItemSearchParams } from "@/features/items/types";

function parseSearchParams(params: SearchPageParams): ItemSearchParams {
  return {
    keywords: params.keywords,
    category: params.category,
    province: params.province,
    date: params.date as any,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    condition: params.condition as any,
    order_by: params.order_by as ItemSearchParams["order_by"],
  };
}

export async function prefetchSearchItems(params: SearchPageParams) {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  const serviceParams = parseSearchParams(params);

  await queryClient.prefetchQuery({
    queryKey: ["items", params],
    queryFn: async () => {
      const result = await getItems(supabase, serviceParams);

      if (!result.success) {
        console.error("Error en prefetch:", result.error);
        return []; // Retornar array vacío como fallback
      }

      return result.data;
    },
  });

  return dehydrate(queryClient);
}
