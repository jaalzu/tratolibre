"use server";

import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getSearchPageDataAction } from "./queries";
import { SearchPageParams } from "../types";

export async function prefetchSearchItems(
  params: SearchPageParams,
  userId: string | null,
) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["search-results", params],
    queryFn: () => getSearchPageDataAction(params, userId),
  });

  return dehydrate(queryClient);
}
