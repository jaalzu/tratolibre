import type { NotificationType } from "./types";

export type SalePayload = {
  item_title: string;
  item_id: string;
  buyer_id: string;
  purchase_id: string;
};
export type PurchasePayload = {
  item_title: string;
  item_id: string;
  owner_id: string;
  purchase_id: string;
};
export type ReviewPayload = {
  rating: number;
  item_title: string;
  reviewer_id: string;
  purchase_id: string;
};

export type NotificationPayloads = {
  sale_completed: SalePayload;
  purchase_completed: PurchasePayload;
  review_received: ReviewPayload;
};

export type NotificationConfig = {
  iconClass: string;
  color: string;
  label: string | { text: string; rating: number };
  href: string;
};

export function getNotificationConfig<T extends NotificationType>(
  type: T,
  data: NotificationPayloads[T],
): NotificationConfig | null {
  switch (type) {
    case "sale_completed": {
      const d = data as SalePayload;
      return {
        iconClass: "bx bx-tag",
        color: "var(--chakra-colors-brand-default)",
        label: `Marcaste "${d.item_title}" como vendido`,
        href: `/item/${d.item_id}`,
      };
    }
    case "purchase_completed": {
      const d = data as PurchasePayload;
      return {
        iconClass: "bx bx-shopping-bag",
        color: "var(--chakra-colors-accent-default)",
        label: `Te marcaron como comprador de "${d.item_title}"`,
        href: `/item/${d.item_id}`,
      };
    }
    case "review_received": {
      const d = data as ReviewPayload;
      return {
        iconClass: "bx bx-star",
        color: "var(--chakra-colors-yellow-500)",
        label: { text: "Recibiste una reseña de", rating: d.rating },
        href: "/profile",
      };
    }
    default:
      return null;
  }
}
