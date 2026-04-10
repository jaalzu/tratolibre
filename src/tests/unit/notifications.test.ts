import { describe, it, expect } from "vitest";
import { getNotificationConfig } from "@/features/notifications/services/notification-config.service";
import { Tag, ShoppingBag, Star } from "@boxicons/react";

describe("getNotificationConfig", () => {
  it("retorna config correcta para sale_completed", () => {
    const config = getNotificationConfig("sale_completed", {
      item_title: "PlayStation 5",
      item_id: "item-123",
      buyer_id: "buyer-123",
      purchase_id: "purchase-123",
    });

    expect(config).not.toBeNull();
    // 1. Ahora comparamos el componente, no el string
    expect(config?.Icon).toBe(Tag);
    expect(config?.href).toBe("/item/item-123");
    expect(config?.label).toBe('Marcaste "PlayStation 5" como vendido');
  });

  it("retorna config correcta para purchase_completed", () => {
    const config = getNotificationConfig("purchase_completed", {
      item_title: "PlayStation 5",
      item_id: "item-123",
      owner_id: "owner-123",
      purchase_id: "purchase-123",
    });

    expect(config).not.toBeNull();
    expect(config?.Icon).toBe(ShoppingBag); // 2. Comparamos contra el componente ShoppingBag
    expect(config?.href).toBe("/item/item-123");
  });

  it("retorna config correcta para review_received", () => {
    const config = getNotificationConfig("review_received", {
      rating: 5,
      item_title: "PlayStation 5",
      reviewer_id: "reviewer-123",
      purchase_id: "purchase-123",
    });

    expect(config).not.toBeNull();
    expect(config?.Icon).toBe(Star); // 3. Comparamos contra el componente Star
    expect(config?.href).toBe("/profile");
  });

  it("el label de review_received incluye el rating", () => {
    const config = getNotificationConfig("review_received", {
      rating: 4,
      item_title: "PlayStation 5",
      reviewer_id: "reviewer-123",
      purchase_id: "purchase-123",
    });

    // 4. Verificamos que el objeto del label tenga el rating
    expect(config?.label).toMatchObject({ rating: 4 });
  });

  it("retorna null para tipo desconocido", () => {
    const config = getNotificationConfig("tipo_inexistente" as any, {} as any);
    expect(config).toBeNull();
  });
});
