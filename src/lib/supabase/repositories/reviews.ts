/**
 * ⭐ Repositorio de Reviews (reseñas/calificaciones)
 * Operaciones de base de datos para reviews de usuarios
 */

import { BaseRepository } from "./base";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Review } from "../core/types";
import { DatabaseError } from "../core/errors";

export class ReviewsRepository extends BaseRepository<Review> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "reviews");
  }

  // Obtener reviews de un usuario (recibidas)
  async findByReviewedUser(
    userId: string,
    options?: { limit?: number; offset?: number },
  ) {
    let query = this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        reviewer:profiles!reviewer_id (
          id,
          name,
          avatar_url
        ),
        item:items!item_id (
          id,
          title,
          images
        )
      `,
      )
      .eq("reviewed_id", userId)
      .order("created_at", { ascending: false });

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message, error.code);
    return data;
  }

  // Obtener reviews hechas por un usuario
  async findByReviewer(
    userId: string,
    options?: { limit?: number; offset?: number },
  ) {
    let query = this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        reviewed:profiles!reviewed_id (
          id,
          name,
          avatar_url
        ),
        item:items!item_id (
          id,
          title,
          images
        )
      `,
      )
      .eq("reviewer_id", userId)
      .order("created_at", { ascending: false });

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message, error.code);
    return data;
  }

  // Verificar si existe review para una compra
  async findByPurchase(purchaseId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("purchase_id", purchaseId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(error.message, error.code);
    }

    return data;
  }

  // Verificar si un usuario ya reviewó a otro por un item específico
  async hasReviewed(
    reviewerId: string,
    reviewedId: string,
    itemId: string,
  ): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("id")
      .eq("reviewer_id", reviewerId)
      .eq("reviewed_id", reviewedId)
      .eq("item_id", itemId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(error.message, error.code);
    }

    return data !== null;
  }

  // Calcular rating promedio de un usuario
  async calculateAverageRating(
    userId: string,
  ): Promise<{ average: number; count: number }> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("rating")
      .eq("reviewed_id", userId);

    if (error) throw new DatabaseError(error.message, error.code);

    if (!data || data.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = data.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / data.length;

    return {
      average: Math.round(average * 10) / 10, // Redondear a 1 decimal
      count: data.length,
    };
  }

  // Obtener distribución de ratings
  async getRatingDistribution(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("rating")
      .eq("reviewed_id", userId);

    if (error) throw new DatabaseError(error.message, error.code);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    data?.forEach((r) => {
      distribution[r.rating as keyof typeof distribution]++;
    });

    return distribution;
  }
}
