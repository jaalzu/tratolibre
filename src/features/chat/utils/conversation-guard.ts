// chat/utils/conversation-guards.ts
import type { ConversationExtended } from "../schemas";

interface ValidatedConversationData {
  item: {
    id: string;
    title: string;
    images: string[];
    sale_price: number;
  };
  buyerId: string;
  sellerId: string;
  buyer: {
    name: string;
    avatar_url: string | null;
  };
  seller: {
    name: string;
    avatar_url: string | null;
  };
}

/**
 * Valida que la conversación tenga todos los datos necesarios
 * Retorna null si falta algo crítico
 */
export function validateConversationData(
  conversation: ConversationExtended | null,
): ValidatedConversationData | null {
  if (!conversation) return null;
  if (!conversation.item_id) return null;
  if (!conversation.items) return null;
  if (!conversation.buyer_id) return null;
  if (!conversation.seller_id) return null;
  if (!conversation.buyer) return null;
  if (!conversation.seller) return null;

  return {
    item: {
      id: conversation.item_id,
      title: conversation.items.title,
      images: conversation.items.images,
      sale_price: conversation.items.sale_price,
    },
    buyerId: conversation.buyer_id,
    sellerId: conversation.seller_id,
    buyer: conversation.buyer,
    seller: conversation.seller,
  };
}
