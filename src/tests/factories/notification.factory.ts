export function createNotification(overrides = {}) {
  return {
    id: "notification-id-123",
    user_id: "test-user-id-123",
    type: "purchase_completed",
    data: {
      item_id: "item-id-123",
      item_title: "PlayStation 5",
      owner_id: "seller-id-456",
      purchase_id: "purchase-id-123",
    },
    read: false,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}
