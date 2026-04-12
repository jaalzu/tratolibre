// chat/mappers/conversation.mapper.ts
import {
  ConversationSummarySchema,
  ConversationExtendedSchema,
  ConversationBuyerSchema,
  ProfilePublicSchema,
  ItemSummarySchema,
  type ConversationExtended,
  type ConversationBuyer,
  type ConversationSummary,
} from "@/features/chat/schemas";
import { Database } from "@/lib/supabase/database.types";

type ConversationSummaryRow =
  Database["public"]["Views"]["conversation_summaries"]["Row"];
type MessageRow = Database["public"]["Tables"]["messages"]["Row"];

/**
 * Mapea un array de mensajes no leídos a un mapa de contadores por conversación
 */
export function mapUnreadMessagesToCountMap(
  messages: Pick<MessageRow, "conversation_id">[],
): Record<string, number> {
  return messages.reduce((acc: Record<string, number>, msg) => {
    if (!msg.conversation_id) return acc;
    acc[msg.conversation_id] = (acc[msg.conversation_id] ?? 0) + 1;
    return acc;
  }, {});
}

/**
 * Mapea una fila de conversation_summaries a ConversationExtended
 */
export function mapConversationSummaryToExtended(
  rawSummary: ConversationSummaryRow,
  unreadCount: number = 0,
): ConversationExtended {
  // 1. Primero validamos el input crudo con ConversationSummarySchema
  const summary: ConversationSummary =
    ConversationSummarySchema.parse(rawSummary);

  // 2. Parse y valida los JSON fields
  let buyer = null;
  let seller = null;
  let items = null;

  try {
    if (summary.buyer) {
      buyer = ProfilePublicSchema.parse(summary.buyer);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to parse buyer:", error);
    }
  }

  try {
    if (summary.seller) {
      seller = ProfilePublicSchema.parse(summary.seller);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to parse seller:", error);
    }
  }

  try {
    if (summary.items) {
      items = ItemSummarySchema.parse(summary.items);
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to parse items:", error);
    }
  }

  // 3. Construimos el objeto extendido
  const mapped = {
    ...summary,
    hasUnread: unreadCount > 0,
    unreadCount,
    lastMessage: summary.last_message_content
      ? {
          content: summary.last_message_content,
          created_at: summary.last_message_at ?? new Date().toISOString(),
        }
      : null,
    buyer,
    seller,
    items,
  };

  // 4. Validamos el output final con ConversationExtendedSchema
  return ConversationExtendedSchema.parse(mapped);
}

/**
 * Mapea múltiples conversation summaries a ConversationExtended[]
 */
export function mapConversationSummariesToExtended(
  summaries: ConversationSummaryRow[],
  unreadMap: Record<string, number> = {},
): ConversationExtended[] {
  return summaries
    .map((summary) => {
      try {
        const unreadCount = summary.id ? (unreadMap[summary.id] ?? 0) : 0;
        return mapConversationSummaryToExtended(summary, unreadCount);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to map conversation:", summary.id, error);
        }
        return null;
      }
    })
    .filter((conv): conv is ConversationExtended => conv !== null);
}

/**
 * Mapea conversaciones con compradores (para vendedor viendo sus items)
 */
export function mapConversationsWithBuyers(
  conversations: any[],
): ConversationBuyer[] {
  return conversations
    .map((conv) => {
      try {
        return ConversationBuyerSchema.parse(conv);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "Failed to map conversation with buyer:",
            conv.id,
            error,
          );
        }
        return null;
      }
    })
    .filter((conv): conv is ConversationBuyer => conv !== null);
}
