/**
 * Repositorio base con operaciones CRUD genéricas
 * Todos los repositorios específicos extienden de esta clase
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseError, NotFoundError } from "../core/errors";

export abstract class BaseRepository<
  TRow,
  TInsert = Partial<TRow>,
  TUpdate = Partial<TRow>,
> {
  constructor(
    protected supabase: SupabaseClient,
    protected tableName: string,
  ) {}

  async findById(id: string): Promise<TRow | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw new DatabaseError(error.message, error.code);
    }

    return data as TRow;
  }

  async findAll(options?: {
    limit?: number;
    offset?: number;
  }): Promise<TRow[]> {
    let query = this.supabase.from(this.tableName).select("*");

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 10) - 1,
      );

    const { data, error } = await query;

    if (error) throw new DatabaseError(error.message, error.code);
    return data as TRow[];
  }

  async create(entity: TInsert): Promise<TRow> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(entity as any)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as TRow;
  }

  async update(id: string, entity: TUpdate): Promise<TRow> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(entity as any)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as TRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw new DatabaseError(error.message, error.code);
  }

  async count(filters?: Record<string, any>): Promise<number> {
    let query = this.supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { count, error } = await query;

    if (error) throw new DatabaseError(error.message, error.code);
    return count ?? 0;
  }

  async exists(id: string): Promise<boolean> {
    const item = await this.findById(id);
    return item !== null;
  }
}
