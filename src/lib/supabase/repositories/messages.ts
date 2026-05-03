/**
 *  Repositorio de Messages (mensajes)
 * Operaciones de base de datos para mensajes en conversaciones
 */

import { BaseRepository } from "./base";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message } from "../core/types";
import { DatabaseError } from "../core/errors";

export class MessagesRepository extends BaseRepository<Message> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "messages");
  }

  // Obtener mensajes de una conversación
  async findByConversation(
    conversationId: string,
    options?: { limit?: number; offset?: number },
  ) {
    let query = this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        sender:profiles!sender_id (id, name, avatar_url)
      `,
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset)
      query = query.range(
        options.offset,
        options.offset + (options.limit || 50) - 1,
      );

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message, error.code);
    return data;
  }

  // Marcar mensajes como leídos
  async markAsRead(conversationId: string, userId: string) {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .eq("read", false);

    if (error) throw new DatabaseError(error.message, error.code);
  }

  // Contar mensajes no leídos de un usuario
  async countUnread(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .neq("sender_id", userId)
      .eq("read", false);

    if (error) throw new DatabaseError(error.message, error.code);
    return count ?? 0;
  }
}
