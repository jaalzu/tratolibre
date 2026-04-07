// features/search/prefetchSearchItems.ts
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getItems } from "@/features/items/services/items-service"; // EL SERVICE CON sale_price
import { createClient } from "@/lib/supabase/server";
import { SearchPageParams } from "./types";

// features/search/prefetchSearchItems.ts
export async function prefetchSearchItems(params: SearchPageParams) {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  // IMPORTANTE: La key debe ser ['items', params]
  await queryClient.prefetchQuery({
    queryKey: ["items", params],
    queryFn: () => getItems(supabase, params),
  });

  return dehydrate(queryClient);
}
