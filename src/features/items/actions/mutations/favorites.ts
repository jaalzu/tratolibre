"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import {
  checkFavoriteExists,
  removeFavorite,
  addFavorite,
} from "../../services/favorites-service";

export async function toggleFavoriteAction(itemId: string) {
  try {
    const { supabase, user } = await getAuthUser();
    if (!user) return { error: "No autorizado" };

    const existing = await checkFavoriteExists(supabase, user.id, itemId);

    if (existing) {
      await removeFavorite(supabase, existing.id);
      return { favorited: false };
    }

    await addFavorite(supabase, user.id, itemId);
    return { favorited: true };
  } catch (error) {
    console.error(`Error en toggleFavorite para item ${itemId}:`, error);
    return { error: "No se pudo actualizar favoritos" };
  }
}
