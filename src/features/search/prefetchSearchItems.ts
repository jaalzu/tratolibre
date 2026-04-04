// features/search/lib/prefetchSearchItems.ts
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getItems } from "@/features/items/actions";
import { SearchPageParams } from "@/features/search/actions";

export async function prefetchSearchItems(params: SearchPageParams) {
  const queryClient = new QueryClient();

  // Convertir SearchPageParams a GetItemsParams (mismo formato que en SearchResults)
  const itemsParams = {
    query: params.keywords,
    category: params.category,
    province: params.province,
    condition: params.condition,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    date: params.date as "today" | "week" | "month" | undefined,
    order_by: params.order_by as
      | "closest"
      | "most_relevance"
      | "price_asc"
      | "price_desc"
      | undefined,
  };

  await queryClient.prefetchQuery({
    queryKey: ["items", itemsParams],
    queryFn: () => getItems(itemsParams),
  });

  return dehydrate(queryClient);
}
