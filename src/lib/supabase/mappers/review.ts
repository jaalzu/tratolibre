/**
 * 🔄 Mapper de Reviews
 * Transforma datos entre DB y Domain
 */

import type { Review } from "../core/types";

export interface ReviewDTO {
  id: string;
  reviewerId: string;
  reviewedId: string;
  itemId: string | null;
  purchaseId: string | null;
  rating: number;
  comment: string | null;
  role: string;
  createdAt: Date;
}

export interface ReviewWithDetailsDTO extends ReviewDTO {
  reviewer: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  item?: {
    id: string;
    title: string;
    images: string[];
  };
}

export interface CreateReviewInput {
  reviewedId: string;
  itemId?: string;
  purchaseId?: string;
  rating: number;
  comment?: string;
  role: "buyer" | "seller";
}

export const reviewMapper = {
  // DB Row → DTO
  toDTO(review: Review): ReviewDTO {
    return {
      id: review.id,
      reviewerId: review.reviewer_id,
      reviewedId: review.reviewed_id,
      itemId: review.item_id,
      purchaseId: review.purchase_id,
      rating: review.rating,
      comment: review.comment,
      role: review.role,
      createdAt: new Date(review.created_at!),
    };
  },

  // DB Row con detalles → DTO completo
  toDTOWithDetails(review: any): ReviewWithDetailsDTO {
    return {
      ...this.toDTO(review),
      reviewer: {
        id: review.reviewer.id,
        name: review.reviewer.name,
        avatarUrl: review.reviewer.avatar_url,
      },
      item: review.item
        ? {
            id: review.item.id,
            title: review.item.title,
            images: review.item.images || [],
          }
        : undefined,
    };
  },

  // CreateReviewInput → DB Insert
  toInsert(input: CreateReviewInput, reviewerId: string) {
    return {
      reviewer_id: reviewerId,
      reviewed_id: input.reviewedId,
      item_id: input.itemId,
      purchase_id: input.purchaseId,
      rating: input.rating,
      comment: input.comment,
      role: input.role,
    };
  },

  // Array
  toDTOWithDetailsArray(reviews: any[]): ReviewWithDetailsDTO[] {
    return reviews.map((r) => this.toDTOWithDetails(r));
  },
};
