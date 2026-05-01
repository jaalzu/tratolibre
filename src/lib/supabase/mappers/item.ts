/**
 * 🔄 Mapper de Items
 * Transforma datos entre DB (snake_case) y Domain/DTO (camelCase)
 */

import type { Item, ItemInsert, ItemUpdate } from "../core/types";

// DTO: Data Transfer Object (lo que enviamos al cliente)
export interface ItemDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string | null;
  type: string | null;
  salePrice: number | null;
  images: string[];
  province: string | null;
  city: string | null;
  location: string | null;
  rules: string | null;
  available: boolean;
  sold: boolean;
  viewsCount: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date | null;
  soldAt: Date | null;
}

// DTO con owner incluido
export interface ItemWithOwnerDTO extends ItemDTO {
  owner: {
    id: string;
    name: string;
    avatarUrl: string | null;
    rating: number | null;
    reviewsCount: number;
    verified: boolean;
  };
}

// Input para crear item
export interface CreateItemInput {
  title: string;
  description: string;
  category: string;
  condition?: string;
  type?: string;
  salePrice?: number;
  images?: string[];
  province?: string;
  city?: string;
  location?: string;
  rules?: string;
}

// Input para actualizar item
export interface UpdateItemInput {
  title?: string;
  description?: string;
  category?: string;
  condition?: string;
  type?: string;
  salePrice?: number;
  images?: string[];
  province?: string;
  city?: string;
  location?: string;
  rules?: string;
  available?: boolean;
}

export const itemMapper = {
  // DB Row → DTO
  toDTO(item: Item): ItemDTO {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      condition: item.condition,
      type: item.type,
      salePrice: item.sale_price,
      images: item.images || [],
      province: item.province,
      city: item.city,
      location: item.location,
      rules: item.rules,
      available: item.available ?? true,
      sold: item.sold ?? false,
      viewsCount: item.views_count ?? 0,
      ownerId: item.owner_id,
      createdAt: new Date(item.created_at!),
      updatedAt: item.updated_at ? new Date(item.updated_at) : null,
      soldAt: item.sold_at ? new Date(item.sold_at) : null,
    };
  },

  // DB Row con owner → DTO con owner
  toDTOWithOwner(item: any): ItemWithOwnerDTO {
    return {
      ...this.toDTO(item),
      owner: {
        id: item.owner.id,
        name: item.owner.name,
        avatarUrl: item.owner.avatar_url,
        rating: item.owner.rating,
        reviewsCount: item.owner.reviews_count ?? 0,
        verified: item.owner.verified ?? false,
      },
    };
  },

  // CreateItemInput → DB Insert
  toInsert(input: CreateItemInput, ownerId: string): ItemInsert {
    return {
      title: input.title,
      description: input.description,
      category: input.category,
      condition: input.condition,
      type: input.type,
      sale_price: input.salePrice,
      images: input.images,
      province: input.province,
      city: input.city,
      location: input.location,
      rules: input.rules,
      owner_id: ownerId,
    };
  },

  // UpdateItemInput → DB Update
  toUpdate(input: UpdateItemInput): ItemUpdate {
    return {
      title: input.title,
      description: input.description,
      category: input.category,
      condition: input.condition,
      type: input.type,
      sale_price: input.salePrice,
      images: input.images,
      province: input.province,
      city: input.city,
      location: input.location,
      rules: input.rules,
      available: input.available,
    };
  },

  // Array de items
  toDTOArray(items: Item[]): ItemDTO[] {
    return items.map((item) => this.toDTO(item));
  },
};
