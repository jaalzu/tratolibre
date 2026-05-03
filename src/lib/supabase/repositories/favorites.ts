/**
 *  Repositorio de Favorites (favoritos)
 * Operaciones de base de datos para favoritos de usuarios
 */

import { BaseRepository } from "./base";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Favorite } from "../core/types";
import { DatabaseError } from "../core/errors";

export class FavoritesRepository extends BaseRepository<Favorite> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "favorites");
  }

  // Obtener favoritos de un usuario con info del item
  async findByUserWithItems(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        item:items!item_id (
          id,
          title,
          images,
          sale_price,
          category,
          available,
          sold
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error.code);
    return data;
  }

  // Verificar si un item está en favoritos
  async isFavorite(userId: string, itemId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("id")
      .eq("user_id", userId)
      .eq("item_id", itemId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(error.message, error.code);
    }

    return data !== null;
  }

  // Toggle favorito (agregar o quitar)
  async toggle(
    userId: string,
    itemId: string,
  ): Promise<{ action: "added" | "removed" }> {
    const exists = await this.isFavorite(userId, itemId);

    if (exists) {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq("user_id", userId)
        .eq("item_id", itemId);

      if (error) throw new DatabaseError(error.message, error.code);
      return { action: "removed" };
    } else {
      await this.create({ user_id: userId, item_id: itemId });
      return { action: "added" };
    }
  }

  // Contar favoritos de un item
  async countByItem(itemId: string): Promise<number> {
    return this.count({ item_id: itemId });
  }
}
