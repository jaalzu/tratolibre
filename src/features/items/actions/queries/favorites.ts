"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { createClient } from "@/lib/supabase/client/server";
import { Item, FavoritesListResult, FavoriteIdsResult } from "../../types";
import { mapSupabaseToItemError } from "../../services/item-error.mapper";

// ============================================
// GET USER FAVORITES
// ============================================

export async function getUserFavorites(): FavoritesListResult {
  try {
    const { supabase, user } = await getAuthUser();

    if (!user) {
      return {
        success: false,
        error: {
          type: "unauthorized",
          message: "Debes iniciar sesión para ver tus favoritos",
        },
      };
    }

    const { data, error } = await supabase
      .from("favorites")
      .select("item_id, items(*, profiles(name, avatar_url, rating))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        success: false,
        error: mapSupabaseToItemError(error, "getUserFavorites"),
      };
    }

    // Filtrar items válidos (no vendidos y disponibles)
    const validItems = (data ?? [])
      .map((f) => f.items as unknown as Item)
      .filter((item): item is Item => !!item && !item.sold && !!item.available);

    return {
      success: true,
      data: validItems,
    };
  } catch (error) {
    console.error("Error crítico en getUserFavorites:", error);
    return {
      success: false,
      error: mapSupabaseToItemError(error, "getUserFavorites"),
    };
  }
}

// ============================================
// GET USER FAVORITE IDs
// ============================================

export async function getUserFavoriteIds(userId: string): FavoriteIdsResult {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("favorites")
      .select("item_id")
      .eq("user_id", userId);

    if (error) {
      return {
        success: false,
        error: mapSupabaseToItemError(error, "getUserFavoriteIds"),
      };
    }

    return {
      success: true,
      data: data?.map((f) => f.item_id) ?? [],
    };
  } catch (error) {
    console.error(`Error crítico en getUserFavoriteIds para ${userId}:`, error);
    return {
      success: false,
      error: mapSupabaseToItemError(error, "getUserFavoriteIds"),
    };
  }
}
