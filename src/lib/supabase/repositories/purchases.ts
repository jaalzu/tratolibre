/**
 * 🛒 Repositorio de Purchases (compras/ventas)
 * Operaciones de base de datos para transacciones de compra
 */

import { BaseRepository } from "./base";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Purchase } from "../core/types";
import { DatabaseError } from "../core/errors";

export class PurchasesRepository extends BaseRepository<Purchase> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "purchases");
  }

  // Obtener compras de un usuario (como comprador)
  async findByBuyer(
    buyerId: string,
    options?: { limit?: number; offset?: number },
  ) {
    let query = this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        item:items!item_id (
          id,
          title,
          images,
          category
        ),
        seller:profiles!owner_id (
          id,
          name,
          avatar_url
        )
      `,
      )
      .eq("buyer_id", buyerId)
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

  // Obtener ventas de un usuario (como vendedor)
  async findBySeller(
    sellerId: string,
    options?: { limit?: number; offset?: number },
  ) {
    let query = this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        item:items!item_id (
          id,
          title,
          images,
          category
        ),
        buyer:profiles!buyer_id (
          id,
          name,
          avatar_url
        )
      `,
      )
      .eq("owner_id", sellerId)
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

  // Obtener compra por item (verificar si un item ya fue comprado)
  async findByItem(itemId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("item_id", itemId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(error.message, error.code);
    }

    return data;
  }

  // Actualizar estado de compra
  async updateStatus(
    purchaseId: string,
    status: "pending" | "completed" | "cancelled",
  ) {
    return this.update(purchaseId, { status });
  }

  // Obtener estadísticas de ventas de un usuario
  async getSellerStats(sellerId: string) {
    const { data: total, error: totalError } = await this.supabase
      .from(this.tableName)
      .select("sale_price")
      .eq("owner_id", sellerId)
      .eq("status", "completed");

    if (totalError)
      throw new DatabaseError(totalError.message, totalError.code);

    const totalRevenue =
      total?.reduce((sum, p) => sum + (p.sale_price || 0), 0) || 0;
    const totalSales = total?.length || 0;

    const { count: pendingCount } = await this.supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("owner_id", sellerId)
      .eq("status", "pending");

    return {
      totalRevenue,
      totalSales,
      pendingSales: pendingCount || 0,
      averageSalePrice: totalSales > 0 ? totalRevenue / totalSales : 0,
    };
  }
}
