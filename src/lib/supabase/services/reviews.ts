/**
 * 🎯 Service de Reviews
 * Lógica de negocio para reseñas y calificaciones
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { ReviewsRepository } from "../repositories/reviews";
import { ProfilesRepository } from "../repositories/profiles";
import { PurchasesRepository } from "../repositories/purchases";
import {
  reviewMapper,
  type ReviewWithDetailsDTO,
  type CreateReviewInput,
} from "../mappers/review";
import {
  UnauthorizedError,
  NotFoundError,
  DatabaseError,
} from "../core/errors";

export class ReviewsService {
  private repository: ReviewsRepository;
  private profilesRepo: ProfilesRepository;
  private purchasesRepo: PurchasesRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new ReviewsRepository(supabase);
    this.profilesRepo = new ProfilesRepository(supabase);
    this.purchasesRepo = new PurchasesRepository(supabase);
  }

  /**
   * Obtener reviews de un usuario
   */
  async getUserReviews(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<ReviewWithDetailsDTO[]> {
    const reviews = await this.repository.findByReviewedUser(userId, options);
    return reviewMapper.toDTOWithDetailsArray(reviews);
  }

  /**
   * Obtener reviews hechas por un usuario
   */
  async getReviewsByUser(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<ReviewWithDetailsDTO[]> {
    const reviews = await this.repository.findByReviewer(userId, options);
    return reviewMapper.toDTOWithDetailsArray(reviews);
  }

  /**
   * Crear review
   */
  async create(
    input: CreateReviewInput,
    reviewerId: string,
  ): Promise<ReviewWithDetailsDTO> {
    // No puede reviewarse a sí mismo
    if (input.reviewedId === reviewerId) {
      throw new UnauthorizedError("No podés dejarte una review a vos mismo");
    }

    // Verificar que no haya reviewado antes al mismo usuario por el mismo item
    if (input.itemId) {
      const hasReviewed = await this.repository.hasReviewed(
        reviewerId,
        input.reviewedId,
        input.itemId,
      );
      if (hasReviewed) {
        throw new DatabaseError("Ya dejaste una review para esta transacción");
      }
    }

    // Si hay purchaseId, verificar que sea parte de la transacción
    if (input.purchaseId) {
      const purchase = await this.purchasesRepo.findById(input.purchaseId);
      if (!purchase) throw new NotFoundError("Purchase", input.purchaseId);

      if (
        purchase.buyer_id !== reviewerId &&
        purchase.owner_id !== reviewerId
      ) {
        throw new UnauthorizedError("No formás parte de esta transacción");
      }

      // Verificar que no haya review para esta compra
      const existingReview = await this.repository.findByPurchase(
        input.purchaseId,
      );
      if (existingReview) {
        throw new DatabaseError("Ya existe una review para esta compra");
      }
    }

    const insertData = reviewMapper.toInsert(input, reviewerId);
    const created = await this.repository.create(insertData);

    // Actualizar rating del usuario reviewado
    const { average, count } = await this.repository.calculateAverageRating(
      input.reviewedId,
    );
    await this.profilesRepo.updateRating(input.reviewedId, average, count);

    // Obtener la review con detalles
    const reviews = await this.repository.findByReviewedUser(input.reviewedId, {
      limit: 1,
    });
    const review = reviews.find((r) => r.id === created.id);

    if (!review) throw new NotFoundError("Review", created.id);

    return reviewMapper.toDTOWithDetails(review);
  }

  /**
   * Obtener rating promedio y distribución
   */
  async getUserRating(userId: string) {
    const { average, count } =
      await this.repository.calculateAverageRating(userId);
    const distribution = await this.repository.getRatingDistribution(userId);

    return {
      average,
      count,
      distribution,
    };
  }

  /**
   * Eliminar review (solo el que la creó o admin)
   */
  async delete(reviewId: string, userId: string): Promise<void> {
    const review = await this.repository.findById(reviewId);
    if (!review) throw new NotFoundError("Review", reviewId);

    if (review.reviewer_id !== userId) {
      throw new UnauthorizedError("Solo podés eliminar tus propias reviews");
    }

    await this.repository.delete(reviewId);

    // Recalcular rating del usuario reviewado
    const { average, count } = await this.repository.calculateAverageRating(
      review.reviewed_id,
    );
    await this.profilesRepo.updateRating(review.reviewed_id, average, count);
  }
}
