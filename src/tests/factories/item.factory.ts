export function createItem(overrides = {}) {
  return {
    id: "item-id-123",
    title: "PlayStation 5",
    description: "Descripción del item",
    sale_price: 150000,
    images: ["https://example.com/image.jpg"],
    category: "juegos",
    condition: "good",
    province: "Buenos Aires",
    city: "CABA",
    location: null,
    type: "sale",
    sold: false,
    available: true,
    owner_id: "test-user-id-123",
    created_at: new Date().toISOString(),
    ...overrides,
  };
}
