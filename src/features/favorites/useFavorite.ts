"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  toggleFavoriteAction,
  getUserFavoriteIds,
} from "@/features/items/actions";

export const useFavorite = (
  itemId: string,
  userId: string | null,
  initialFavorited?: boolean,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Estado local que manda en la UI
  const [favorited, setFavorited] = useState(initialFavorited ?? false);

  const { data: favoriteIds } = useQuery({
    queryKey: ["favoriteIds", userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await getUserFavoriteIds(userId);
      return res.success ? res.data : [];
    },
    enabled: !!userId && initialFavorited === undefined, // Solo pedimos si no sabemos el estado inicial
    staleTime: 1000 * 60 * 5,
  });

  // Sincronizar solo si NO tenemos un valor inicial definido (ej: en la Home)
  useEffect(() => {
    if (initialFavorited !== undefined) {
      setFavorited(initialFavorited);
    } else if (favoriteIds) {
      setFavorited(favoriteIds.includes(itemId));
    }
  }, [favoriteIds, itemId, initialFavorited]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) return router.push("/login");

    const previousValue = favorited;
    setFavorited(!previousValue);

    const result = await toggleFavoriteAction(itemId);

    if (result?.error) {
      setFavorited(previousValue);
    } else {
      // Invalidamos el cache para que otras secciones se enteren del cambio
      queryClient.invalidateQueries({ queryKey: ["favoriteIds", userId] });
    }
  };

  return { favorited, toggle };
};
