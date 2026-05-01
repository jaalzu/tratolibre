/**
 *  Repositorio de Items (publicaciones)
 * Operaciones de base de datos para items/publicaciones
 */

import { BaseRepository } from "./base";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Item, ItemInsert, ItemUpdate } from "../core/types";
import { DatabaseError } from "../core/errors";

export class ItemsRepository extends BaseRepository<
  Item,
  ItemInsert,
  ItemUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "items");
  }

  // Buscar items por owner
  async findByOwnerId(
    ownerId: string,
    options?: { limit?: number; offset?: number },
  ) {
    let query = this.supabase
      .from(this.tableName)
      .select("*")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message, error.code);
    return data as Item[];
  }

  // Buscar items por categoría
  async findByCategory(
    category: string,
    options?: { limit?: number; offset?: number },
  ) {
    let query = this.supabase
      .from(this.tableName)
      .select("*")
      .eq("category", category)
      .eq("available", true)
      .order("created_at", { ascending: false });

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message, error.code);
    return data as Item[];
  }

  // Buscar items disponibles
  async findAvailable(options?: { limit?: number; offset?: number }) {
    let query = this.supabase
      .from(this.tableName)
      .select("*")
      .eq("available", true)
      .eq("sold", false)
      .order("created_at", { ascending: false });

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message, error.code);
    return data as Item[];
  }

  // Buscar por ubicación (provincia)
  async findByProvince(
    province: string,
    options?: { limit?: number; offset?: number },
  ) {
    let query = this.supabase
      .from(this.tableName)
      .select("*")
      .eq("province", province)
      .eq("available", true)
      .order("created_at", { ascending: false });

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message, error.code);
    return data as Item[];
  }

  // Buscar con owner profile (join)
  async findWithOwner(itemId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        owner:profiles!owner_id (
          id,
          name,
          avatar_url,
          rating,
          reviews_count,
          verified
        )
      `,
      )
      .eq("id", itemId)
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data;
  }

  // Incrementar contador de vistas
  async incrementViews(itemId: string): Promise<void> {
    const { error } = await this.supabase.rpc("increment_item_views", {
      item_id: itemId,
    });

    // Si no existe la función RPC, hacerlo manualmente
    if (error?.code === "42883") {
      const item = await this.findById(itemId);
      if (item) {
        await this.update(itemId, {
          views_count: (item.views_count || 0) + 1,
        });
      }
    } else if (error) {
      throw new DatabaseError(error.message, error.code);
    }
  }

  // Marcar como vendido
  async markAsSold(itemId: string): Promise<Item> {
    return this.update(itemId, {
      sold: true,
      available: false,
      sold_at: new Date().toISOString(),
    });
  }

  // Buscar items similares (misma categoría, excluye el actual)
  async findSimilar(itemId: string, category: string, limit = 6) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("category", category)
      .eq("available", true)
      .neq("id", itemId)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Item[];
  }

  // Búsqueda por texto (título + descripción)
  async search(query: string, options?: { limit?: number; offset?: number }) {
    let dbQuery = this.supabase
      .from(this.tableName)
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq("available", true)
      .order("created_at", { ascending: false });

    if (options?.limit) dbQuery = dbQuery.limit(options.limit);
    if (options?.offset)
      dbQuery = dbQuery.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );

    const { data, error } = await dbQuery;
    if (error) throw new DatabaseError(error.message, error.code);
    return data as Item[];
  }
}
