export function createReview(overrides = {}) {
  return {
    id: "review-id-123",
    purchase_id: "purchase-id-123",
    reviewer_id: "test-user-id-123",
    reviewed_id: "seller-id-456",
    rating: 5,
    comment: "Excelente vendedor",
    role: "buyer",
    created_at: new Date().toISOString(),
    ...overrides,
  };
}
