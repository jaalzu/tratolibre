/**
 * 🎯 Service de Favorites
 * Lógica de negocio para favoritos
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { FavoritesRepository } from "../repositories/favorites";
import { favoriteMapper, type FavoriteWithItemDTO } from "../mappers/favorite";
import { NotFoundError } from "../core/errors";

export class FavoritesService {
  private repository: FavoritesRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new FavoritesRepository(supabase);
  }

  /**
   * Obtener favoritos de un usuario con items
   */
  async getUserFavorites(userId: string): Promise<FavoriteWithItemDTO[]> {
    const favorites = await this.repository.findByUserWithItems(userId);
    return favoriteMapper.toDTOWithItemArray(favorites);
  }

  /**
   * Verificar si un item está en favoritos
   */
  async isFavorite(userId: string, itemId: string): Promise<boolean> {
    return this.repository.isFavorite(userId, itemId);
  }

  /**
   * Toggle favorito (agregar/quitar)
   */
  async toggle(
    userId: string,
    itemId: string,
  ): Promise<{ action: "added" | "removed"; count: number }> {
    const result = await this.repository.toggle(userId, itemId);
    const count = await this.repository.countByItem(itemId);

    return {
      action: result.action,
      count,
    };
  }

  /**
   * Contar favoritos de un item
   */
  async getItemFavoritesCount(itemId: string): Promise<number> {
    return this.repository.countByItem(itemId);
  }

  /**
   * Eliminar favorito
   */
  async remove(userId: string, itemId: string): Promise<void> {
    const isFav = await this.repository.isFavorite(userId, itemId);
    if (!isFav) {
      throw new NotFoundError("Favorite", `${userId}-${itemId}`);
    }

    await this.repository.toggle(userId, itemId);
  }
}
