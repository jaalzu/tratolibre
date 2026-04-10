import { Tag, ShoppingBag, Star } from "@boxicons/react";
import type {
  NotificationType,
  NotificationPayloads,
  NotificationConfig,
  SalePayload,
  PurchasePayload,
  ReviewPayload,
} from "../types";

/**
 * Obtiene la configuración de UI para una notificación específica
 * @param type - Tipo de notificación
 * @param data - Datos específicos del tipo de notificación
 * @returns Configuración de UI (icono, color, label, href) o null si el tipo no es válido
 */
export function getNotificationConfig<T extends NotificationType>(
  type: T,
  data: NotificationPayloads[T],
): NotificationConfig | null {
  switch (type) {
    case "sale_completed": {
      const d = data as SalePayload;
      return {
        Icon: Tag,
        color: "var(--chakra-colors-brand-default)",
        label: `Marcaste "${d.item_title}" como vendido`,
        href: `/item/${d.item_id}`,
      };
    }
    case "purchase_completed": {
      const d = data as PurchasePayload;
      return {
        Icon: ShoppingBag,
        color: "var(--chakra-colors-accent-default)",
        label: `Te marcaron como comprador de "${d.item_title}"`,
        href: `/item/${d.item_id}`,
      };
    }
    case "review_received": {
      const d = data as ReviewPayload;
      return {
        Icon: Star,
        color: "var(--chakra-colors-yellow-500)",
        label: { text: "Recibiste una reseña de", rating: d.rating },
        href: "/profile",
      };
    }
    default:
      return null;
  }
}
