/**
 * 🔔 Repositorio de Notifications (notificaciones)
 * Operaciones de base de datos para notificaciones de usuarios
 */

import { BaseRepository } from "./base";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Notification } from "../core/types";
import { DatabaseError } from "../core/errors";

export class NotificationsRepository extends BaseRepository<Notification> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "notifications");
  }

  // Obtener notificaciones de un usuario
  async findByUser(
    userId: string,
    options?: { limit?: number; offset?: number; unreadOnly?: boolean },
  ) {
    let query = this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (options?.unreadOnly) {
      query = query.eq("read", false);
    }

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 20) - 1,
      );

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message, error.code);
    return data as Notification[];
  }

  // Marcar notificación como leída
  async markAsRead(notificationId: string) {
    return this.update(notificationId, { read: true });
  }

  // Marcar todas las notificaciones de un usuario como leídas
  async markAllAsRead(userId: string) {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) throw new DatabaseError(error.message, error.code);
  }

  // Contar notificaciones no leídas
  async countUnread(userId: string): Promise<number> {
    return this.count({ user_id: userId, read: false });
  }

  // Eliminar notificaciones antiguas (cleanup)
  async deleteOlderThan(days: number, userId: string) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("user_id", userId)
      .eq("read", true)
      .lt("created_at", cutoffDate.toISOString());

    if (error) throw new DatabaseError(error.message, error.code);
  }

  // Crear notificación para múltiples usuarios (batch)
  async createBatch(
    notifications: Array<Omit<Notification, "id" | "created_at" | "read">>,
  ) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(notifications as any)
      .select();

    if (error) throw new DatabaseError(error.message, error.code);
    return data as Notification[];
  }
}
