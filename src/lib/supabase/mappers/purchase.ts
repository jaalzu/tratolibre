/**
 * 🔄 Mapper de Purchases
 * Transforma datos entre DB y Domain
 */

import type { Purchase } from "../core/types";

export interface PurchaseDTO {
  id: string;
  buyerId: string;
  ownerId: string;
  itemId: string;
  salePrice: number;
  message: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface PurchaseWithDetailsDTO extends PurchaseDTO {
  item: {
    id: string;
    title: string;
    images: string[];
    category: string;
  };
  buyer?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  seller?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface CreatePurchaseInput {
  itemId: string;
  ownerId: string;
  salePrice: number;
  message?: string;
}

export const purchaseMapper = {
  // DB Row → DTO
  toDTO(purchase: Purchase): PurchaseDTO {
    return {
      id: purchase.id,
      buyerId: purchase.buyer_id,
      ownerId: purchase.owner_id,
      itemId: purchase.item_id,
      salePrice: purchase.sale_price,
      message: purchase.message,
      status: purchase.status ?? "pending",
      createdAt: new Date(purchase.created_at!),
      updatedAt: purchase.updated_at ? new Date(purchase.updated_at) : null,
    };
  },

  // DB Row con detalles → DTO completo
  toDTOWithDetails(purchase: any): PurchaseWithDetailsDTO {
    return {
      ...this.toDTO(purchase),
      item: {
        id: purchase.item.id,
        title: purchase.item.title,
        images: purchase.item.images || [],
        category: purchase.item.category,
      },
      buyer: purchase.buyer
        ? {
            id: purchase.buyer.id,
            name: purchase.buyer.name,
            avatarUrl: purchase.buyer.avatar_url,
          }
        : undefined,
      seller: purchase.seller
        ? {
            id: purchase.seller.id,
            name: purchase.seller.name,
            avatarUrl: purchase.seller.avatar_url,
          }
        : undefined,
    };
  },

  // CreatePurchaseInput → DB Insert
  toInsert(input: CreatePurchaseInput, buyerId: string) {
    return {
      buyer_id: buyerId,
      owner_id: input.ownerId,
      item_id: input.itemId,
      sale_price: input.salePrice,
      message: input.message,
    };
  },

  // Array
  toDTOWithDetailsArray(purchases: any[]): PurchaseWithDetailsDTO[] {
    return purchases.map((p) => this.toDTOWithDetails(p));
  },
};
