// hooks/useUserFavorites.ts
import { useQuery } from "@tanstack/react-query";
import { getUserFavoriteIds } from "@/features/items/actions";

export const useUserFavorites = (userId: string | null) => {
  return useQuery({
    queryKey: ["favoriteIds", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await getUserFavoriteIds(userId);
      return res.success ? res.data : [];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};
