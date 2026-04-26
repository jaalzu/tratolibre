// import { dehydrate, QueryClient } from "@tanstack/react-query";
// import { getItemById } from "@/features/items/actions";

// export async function prefetchItem(id: string) {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ["item", id],
//     queryFn: () => getItemById(id),
//   });

//   return dehydrate(queryClient);
// }
