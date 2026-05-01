/**
 * 🔄 Mapper de Messages
 * Transforma datos entre DB y Domain
 */

import type { Message } from "../core/types";

export interface MessageDTO {
  id: string;
  content: string;
  conversationId: string;
  senderId: string;
  read: boolean;
  createdAt: Date;
}

export interface MessageWithSenderDTO extends MessageDTO {
  sender: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface CreateMessageInput {
  content: string;
  conversationId: string;
}

export const messageMapper = {
  // DB Row → DTO
  toDTO(message: Message): MessageDTO {
    return {
      id: message.id,
      content: message.content,
      conversationId: message.conversation_id!,
      senderId: message.sender_id,
      read: message.read ?? false,
      createdAt: new Date(message.created_at!),
    };
  },

  // DB Row con sender → DTO con sender
  toDTOWithSender(message: any): MessageWithSenderDTO {
    return {
      ...this.toDTO(message),
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        avatarUrl: message.sender.avatar_url,
      },
    };
  },

  // CreateMessageInput → DB Insert
  toInsert(input: CreateMessageInput, senderId: string) {
    return {
      content: input.content,
      conversation_id: input.conversationId,
      sender_id: senderId,
    };
  },

  // Array
  toDTOArray(messages: Message[]): MessageDTO[] {
    return messages.map((m) => this.toDTO(m));
  },

  toDTOWithSenderArray(messages: any[]): MessageWithSenderDTO[] {
    return messages.map((m) => this.toDTOWithSender(m));
  },
};
