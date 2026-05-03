/**
 * 🚨 Repositorio de Reports (reportes/denuncias)
 * Operaciones de base de datos para reportes de contenido/usuarios
 */

import { BaseRepository } from "./base";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Report } from "../core/types";
import { DatabaseError } from "../core/errors";

export class ReportsRepository extends BaseRepository<Report> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "reports");
  }

  // Obtener reportes pendientes
  async findPending(options?: { limit?: number; offset?: number }) {
    let query = this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        reporter:profiles!reporter_id (
          id,
          name,
          avatar_url
        )
      `,
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 20) - 1,
      );

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message, error.code);
    return data;
  }

  // Obtener reportes por target (item o usuario reportado)
  async findByTarget(targetId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        reporter:profiles!reporter_id (
          id,
          name,
          avatar_url
        )
      `,
      )
      .eq("target_id", targetId)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message, error.code);
    return data;
  }

  // Obtener reportes hechos por un usuario
  async findByReporter(
    reporterId: string,
    options?: { limit?: number; offset?: number },
  ) {
    let query = this.supabase
      .from(this.tableName)
      .select("*")
      .eq("reporter_id", reporterId)
      .order("created_at", { ascending: false });

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 20) - 1,
      );

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message, error.code);
    return data as Report[];
  }

  // Verificar si un usuario ya reportó un target
  async hasReported(reporterId: string, targetId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("id")
      .eq("reporter_id", reporterId)
      .eq("target_id", targetId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(error.message, error.code);
    }

    return data !== null;
  }

  // Resolver reporte (marcar como resuelto)
  async resolve(reportId: string, resolvedBy: string) {
    return this.update(reportId, {
      status: "resolved",
      resolved_by: resolvedBy,
      resolved_at: new Date().toISOString(),
    });
  }

  // Rechazar reporte
  async reject(reportId: string, resolvedBy: string) {
    return this.update(reportId, {
      status: "rejected",
      resolved_by: resolvedBy,
      resolved_at: new Date().toISOString(),
    });
  }

  // Contar reportes por tipo
  async countByType(type: "item" | "user") {
    return this.count({ type, status: "pending" });
  }

  // Obtener estadísticas de reportes
  async getStats() {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("status, type");

    if (error) throw new DatabaseError(error.message, error.code);

    const stats = {
      total: data?.length || 0,
      pending: data?.filter((r) => r.status === "pending").length || 0,
      resolved: data?.filter((r) => r.status === "resolved").length || 0,
      rejected: data?.filter((r) => r.status === "rejected").length || 0,
      byType: {
        item: data?.filter((r) => r.type === "item").length || 0,
        user: data?.filter((r) => r.type === "user").length || 0,
      },
    };

    return stats;
  }
}
