/**
 *  Repositorio de Conversations (conversaciones)
 * Operaciones de base de datos para chat entre usuarios
 */

import { BaseRepository } from "./base";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Conversation } from "../core/types";
import { DatabaseError } from "../core/errors";

export class ConversationsRepository extends BaseRepository<Conversation> {
  constructor(supabase: SupabaseClient) {
    super(supabase, "conversations");
  }

  // Obtener conversaciones de un usuario (como buyer o seller)
  async findByUserId(userId: string) {
    const { data, error } = await this.supabase
      .from("conversation_summaries") // Usamos la vista
      .select("*")
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (error) throw new DatabaseError(error.message, error.code);
    return data;
  }

  // Buscar conversación existente entre dos usuarios para un item
  async findExisting(buyerId: string, sellerId: string, itemId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("buyer_id", buyerId)
      .eq("seller_id", sellerId)
      .eq("item_id", itemId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(error.message, error.code);
    }

    return data;
  }

  // Crear o obtener conversación
  async findOrCreate(buyerId: string, sellerId: string, itemId: string) {
    const existing = await this.findExisting(buyerId, sellerId, itemId);

    if (existing) return existing;

    return this.create({
      buyer_id: buyerId,
      seller_id: sellerId,
      item_id: itemId,
    });
  }

  // Obtener conversación con detalles completos
  async findWithDetails(conversationId: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(
        `
        *,
        buyer:profiles!buyer_id (id, name, avatar_url),
        seller:profiles!seller_id (id, name, avatar_url),
        item:items!item_id (id, title, images, sale_price, available)
      `,
      )
      .eq("id", conversationId)
      .single();

    if (error) throw new DatabaseError(error.message, error.code);
    return data;
  }
}
