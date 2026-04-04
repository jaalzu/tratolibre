// features/items/lib/prefetchItems.ts
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getItems, GetItemsParams } from "@/features/items/actions";

export async function prefetchMultipleItems(paramsArray: GetItemsParams[]) {
  const queryClient = new QueryClient();

  await Promise.all(
    paramsArray.map((params) =>
      queryClient.prefetchQuery({
        queryKey: ["items", params],
        queryFn: () => getItems(params),
      }),
    ),
  );

  return dehydrate(queryClient);
}
