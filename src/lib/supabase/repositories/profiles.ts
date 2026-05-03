/**
 *  Repositorio de Profiles (usuarios)
 * Operaciones de base de datos para perfiles de usuario
 */

import { BaseRepository } from "./base";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Profile, ProfileInsert, ProfileUpdate } from "../core/types";
import { DatabaseError } from "../core/errors";

export class ProfilesRepository extends BaseRepository<
  Profile,
  ProfileInsert,
  ProfileUpdate
> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "profiles");
  }

  // Buscar por nombre (parcial)
  async findByName(name: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .ilike("name", `%${name}%`);

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Profile[];
  }

  // Obtener perfil con estadísticas de items
  async findWithItemStats(userId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        items:items!owner_id (count),
        active_items:items!owner_id (count)
      `,
      )
      .eq("id", userId)
      .eq("items.available", true)
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data;
  }

  // Actualizar rating promedio
  async updateRating(userId: string, newRating: number, reviewsCount: number) {
    return this.update(userId, {
      rating: newRating,
      reviews_count: reviewsCount,
    });
  }

  // Verificar usuario
  async verify(userId: string) {
    return this.update(userId, { verified: true });
  }

  // Obtener vendedores destacados
  async getFeaturedSellers(limit = 10) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .not("rating", "is", null)
      .gte("reviews_count", 5)
      .order("rating", { ascending: false })
      .order("reviews_count", { ascending: false })
      .limit(limit);

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Profile[];
  }
}
