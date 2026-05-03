/**
 * Service de Messaging
 * Lógica de negocio para conversaciones y mensajes
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { ConversationsRepository } from "../repositories/conversations";
import { MessagesRepository } from "../repositories/messages";
import {
  conversationMapper,
  type ConversationSummaryDTO,
} from "../mappers/conversation";
import {
  messageMapper,
  type MessageWithSenderDTO,
  type CreateMessageInput,
} from "../mappers/message";
import { checkRateLimit, RATE_LIMITS } from "../utils/rate-limiter";
import { UnauthorizedError, NotFoundError } from "../core/errors";

export class MessagingService {
  private conversationsRepo: ConversationsRepository;
  private messagesRepo: MessagesRepository;

  constructor(private supabase: SupabaseClient) {
    this.conversationsRepo = new ConversationsRepository(supabase);
    this.messagesRepo = new MessagesRepository(supabase);
  }

  /**
   * Obtener conversaciones de un usuario
   */
  async getUserConversations(
    userId: string,
  ): Promise<ConversationSummaryDTO[]> {
    const conversations = await this.conversationsRepo.findByUserId(userId);
    return conversationMapper.toSummaryDTOArray(conversations);
  }

  /**
   * Obtener conversación con detalles
   */
  async getConversation(conversationId: string, userId: string) {
    const conversation =
      await this.conversationsRepo.findWithDetails(conversationId);
    if (!conversation) throw new NotFoundError("Conversation", conversationId);

    // Verificar que el usuario sea parte de la conversación
    if (conversation.buyer_id !== userId && conversation.seller_id !== userId) {
      throw new UnauthorizedError("No tenés acceso a esta conversación");
    }

    return conversation;
  }

  /**
   * Iniciar o continuar conversación
   */
  async startConversation(buyerId: string, sellerId: string, itemId: string) {
    // No puede iniciar conversación con uno mismo
    if (buyerId === sellerId) {
      throw new UnauthorizedError(
        "No podés iniciar una conversación con vos mismo",
      );
    }

    const conversation = await this.conversationsRepo.findOrCreate(
      buyerId,
      sellerId,
      itemId,
    );
    return conversationMapper.toDTO(conversation);
  }

  /**
   * Obtener mensajes de una conversación
   */
  async getMessages(
    conversationId: string,
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<MessageWithSenderDTO[]> {
    // Verificar acceso
    const conversation = await this.conversationsRepo.findById(conversationId);
    if (!conversation) throw new NotFoundError("Conversation", conversationId);
    if (conversation.buyer_id !== userId && conversation.seller_id !== userId) {
      throw new UnauthorizedError("No tenés acceso a esta conversación");
    }

    const messages = await this.messagesRepo.findByConversation(
      conversationId,
      options,
    );
    return messageMapper.toDTOWithSenderArray(messages);
  }

  /**
   * Enviar mensaje
   */
  async sendMessage(
    input: CreateMessageInput,
    senderId: string,
  ): Promise<MessageWithSenderDTO> {
    // Rate limiting
    await checkRateLimit(
      this.supabase,
      senderId,
      "send_message",
      RATE_LIMITS.SEND_MESSAGE,
    );

    // Verificar acceso a la conversación
    const conversation = await this.conversationsRepo.findById(
      input.conversationId,
    );
    if (!conversation)
      throw new NotFoundError("Conversation", input.conversationId);
    if (
      conversation.buyer_id !== senderId &&
      conversation.seller_id !== senderId
    ) {
      throw new UnauthorizedError("No tenés acceso a esta conversación");
    }

    const insertData = messageMapper.toInsert(input, senderId);
    const created = await this.messagesRepo.create(insertData);

    // Obtener el mensaje con el sender
    const messages = await this.messagesRepo.findByConversation(
      input.conversationId,
      { limit: 1, offset: 0 },
    );
    const messageWithSender = messages.find((m) => m.id === created.id);

    if (!messageWithSender) throw new NotFoundError("Message", created.id);

    return messageMapper.toDTOWithSender(messageWithSender);
  }

  /**
   * Marcar mensajes como leídos
   */
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    const conversation = await this.conversationsRepo.findById(conversationId);
    if (!conversation) throw new NotFoundError("Conversation", conversationId);
    if (conversation.buyer_id !== userId && conversation.seller_id !== userId) {
      throw new UnauthorizedError("No tenés acceso a esta conversación");
    }

    await this.messagesRepo.markAsRead(conversationId, userId);
  }

  /**
   * Contar mensajes no leídos
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.messagesRepo.countUnread(userId);
  }
}
