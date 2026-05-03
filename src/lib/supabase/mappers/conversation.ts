/**
 * 🔄 Mapper de Conversations
 * Transforma datos entre DB y Domain
 */

import type { Conversation } from "../core/types";

export interface ConversationDTO {
  id: string;
  buyerId: string;
  sellerId: string;
  itemId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ConversationSummaryDTO {
  id: string;
  buyer: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  seller: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  item: {
    id: string;
    title: string;
    images: string[];
    salePrice: number | null;
  };
  lastMessage: {
    content: string;
    at: Date;
  } | null;
  createdAt: Date;
}

export const conversationMapper = {
  // DB Row → DTO simple
  toDTO(conversation: Conversation): ConversationDTO {
    return {
      id: conversation.id,
      buyerId: conversation.buyer_id,
      sellerId: conversation.seller_id,
      itemId: conversation.item_id,
      createdAt: new Date(conversation.created_at!),
      updatedAt: conversation.updated_at
        ? new Date(conversation.updated_at)
        : null,
    };
  },

  // Vista conversation_summaries → DTO completo
  toSummaryDTO(data: any): ConversationSummaryDTO {
    return {
      id: data.id,
      buyer: {
        id: data.buyer.id,
        name: data.buyer.name,
        avatarUrl: data.buyer.avatar_url,
      },
      seller: {
        id: data.seller.id,
        name: data.seller.name,
        avatarUrl: data.seller.avatar_url,
      },
      item: {
        id: data.items.id,
        title: data.items.title,
        images: data.items.images || [],
        salePrice: data.items.sale_price,
      },
      lastMessage: data.last_message_content
        ? {
            content: data.last_message_content,
            at: new Date(data.last_message_at),
          }
        : null,
      createdAt: new Date(data.created_at),
    };
  },

  // Array
  toSummaryDTOArray(conversations: any[]): ConversationSummaryDTO[] {
    return conversations.map((c) => this.toSummaryDTO(c));
  },
};
