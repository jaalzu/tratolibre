import { Database } from "@/lib/supabase/database.types";
import { ElementType } from "react";

export type NotificationRow =
  Database["public"]["Tables"]["notifications"]["Row"];

export type NotificationType =
  | "sale_completed"
  | "purchase_completed"
  | "review_received";

export type Notification = Omit<NotificationRow, "type" | "data"> & {
  type: NotificationType;
  data: Record<string, unknown>;
};

// Payloads específicos por tipo de notificación
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

// Configuración de UI para notificaciones
export type NotificationConfig = {
  Icon: ElementType;
  color: string;
  label: string | { text: string; rating: number };
  href: string;
};
