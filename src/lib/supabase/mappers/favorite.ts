/**
 * 🔄 Mapper de Favorites
 * Transforma datos entre DB y Domain
 */

import type { Favorite } from "../core/types";

export interface FavoriteDTO {
  id: string;
  userId: string;
  itemId: string;
  createdAt: Date;
}

export interface FavoriteWithItemDTO extends FavoriteDTO {
  item: {
    id: string;
    title: string;
    images: string[];
    salePrice: number | null;
    category: string;
    available: boolean;
    sold: boolean;
  };
}

export const favoriteMapper = {
  // DB Row → DTO
  toDTO(favorite: Favorite): FavoriteDTO {
    return {
      id: favorite.id,
      userId: favorite.user_id,
      itemId: favorite.item_id,
      createdAt: new Date(favorite.created_at!),
    };
  },

  // DB Row con item → DTO con item
  toDTOWithItem(favorite: any): FavoriteWithItemDTO {
    return {
      ...this.toDTO(favorite),
      item: {
        id: favorite.item.id,
        title: favorite.item.title,
        images: favorite.item.images || [],
        salePrice: favorite.item.sale_price,
        category: favorite.item.category,
        available: favorite.item.available ?? true,
        sold: favorite.item.sold ?? false,
      },
    };
  },

  // Array
  toDTOWithItemArray(favorites: any[]): FavoriteWithItemDTO[] {
    return favorites.map((f) => this.toDTOWithItem(f));
  },
};
