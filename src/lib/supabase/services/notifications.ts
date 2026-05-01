/**
 * 🎯 Service de Notifications
 * Lógica de negocio para notificaciones
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { NotificationsRepository } from "../repositories/notifications";
import {
  notificationMapper,
  type NotificationDTO,
  type CreateNotificationInput,
} from "../mappers/notification";
import { UnauthorizedError, NotFoundError } from "../core/errors";

export class NotificationsService {
  private repository: NotificationsRepository;

  constructor(private supabase: SupabaseClient) {
    this.repository = new NotificationsRepository(supabase);
  }

  /**
   * Obtener notificaciones de un usuario
   */
  async getUserNotifications(
    userId: string,
    options?: { limit?: number; offset?: number; unreadOnly?: boolean },
  ): Promise<NotificationDTO[]> {
    const notifications = await this.repository.findByUser(userId, options);
    return notificationMapper.toDTOArray(notifications);
  }

  /**
   * Obtener solo notificaciones no leídas
   */
  async getUnread(
    userId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<NotificationDTO[]> {
    return this.getUserNotifications(userId, { ...options, unreadOnly: true });
  }

  /**
   * Contar notificaciones no leídas
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.repository.countUnread(userId);
  }

  /**
   * Marcar notificación como leída
   */
  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<NotificationDTO> {
    const notification = await this.repository.findById(notificationId);
    if (!notification) throw new NotFoundError("Notification", notificationId);

    // Verificar ownership
    if (notification.user_id !== userId) {
      throw new UnauthorizedError("No tenés acceso a esta notificación");
    }

    const updated = await this.repository.markAsRead(notificationId);
    return notificationMapper.toDTO(updated);
  }

  /**
   * Marcar todas como leídas
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.repository.markAllAsRead(userId);
  }

  /**
   * Crear notificación
   */
  async create(input: CreateNotificationInput): Promise<NotificationDTO> {
    const insertData = notificationMapper.toInsert(input);
    const created = await this.repository.create(insertData);
    return notificationMapper.toDTO(created);
  }

  /**
   * Crear notificaciones en batch (múltiples usuarios)
   */
  async createBatch(
    notifications: CreateNotificationInput[],
  ): Promise<NotificationDTO[]> {
    const insertData = notifications.map((n) => notificationMapper.toInsert(n));
    const created = await this.repository.createBatch(insertData);
    return notificationMapper.toDTOArray(created);
  }

  /**
   * Eliminar notificación
   */
  async delete(notificationId: string, userId: string): Promise<void> {
    const notification = await this.repository.findById(notificationId);
    if (!notification) throw new NotFoundError("Notification", notificationId);

    if (notification.user_id !== userId) {
      throw new UnauthorizedError(
        "No podés eliminar notificaciones de otros usuarios",
      );
    }

    await this.repository.delete(notificationId);
  }

  /**
   * Limpiar notificaciones antiguas (cleanup job)
   */
  async cleanup(userId: string, days = 30): Promise<void> {
    await this.repository.deleteOlderThan(days, userId);
  }

  // ========== HELPERS PARA CREAR NOTIFICACIONES ESPECÍFICAS ==========

  /**
   * Notificar nuevo mensaje
   */
  async notifyNewMessage(
    recipientId: string,
    data: {
      senderId: string;
      senderName: string;
      conversationId: string;
      preview: string;
    },
  ) {
    return this.create({
      userId: recipientId,
      type: "new_message",
      data: {
        senderId: data.senderId,
        senderName: data.senderName,
        conversationId: data.conversationId,
        preview: data.preview.substring(0, 100),
      },
    });
  }

  /**
   * Notificar nuevo favorito
   */
  async notifyNewFavorite(
    ownerId: string,
    data: {
      userId: string;
      userName: string;
      itemId: string;
      itemTitle: string;
    },
  ) {
    return this.create({
      userId: ownerId,
      type: "new_favorite",
      data: {
        userId: data.userId,
        userName: data.userName,
        itemId: data.itemId,
        itemTitle: data.itemTitle,
      },
    });
  }

  /**
   * Notificar solicitud de compra
   */
  async notifyPurchaseRequest(
    sellerId: string,
    data: {
      buyerId: string;
      buyerName: string;
      itemId: string;
      itemTitle: string;
      purchaseId: string;
    },
  ) {
    return this.create({
      userId: sellerId,
      type: "purchase_request",
      data: {
        buyerId: data.buyerId,
        buyerName: data.buyerName,
        itemId: data.itemId,
        itemTitle: data.itemTitle,
        purchaseId: data.purchaseId,
      },
    });
  }

  /**
   * Notificar review recibida
   */
  async notifyReviewReceived(
    userId: string,
    data: {
      reviewerId: string;
      reviewerName: string;
      rating: number;
      itemId?: string;
      itemTitle?: string;
    },
  ) {
    return this.create({
      userId,
      type: "review_received",
      data: {
        reviewerId: data.reviewerId,
        reviewerName: data.reviewerName,
        rating: data.rating,
        itemId: data.itemId,
        itemTitle: data.itemTitle,
      },
    });
  }

  /**
   * Notificar item vendido
   */
  async notifyItemSold(
    ownerId: string,
    data: {
      buyerId: string;
      buyerName: string;
      itemId: string;
      itemTitle: string;
      salePrice: number;
    },
  ) {
    return this.create({
      userId: ownerId,
      type: "item_sold",
      data: {
        buyerId: data.buyerId,
        buyerName: data.buyerName,
        itemId: data.itemId,
        itemTitle: data.itemTitle,
        salePrice: data.salePrice,
      },
    });
  }
}
