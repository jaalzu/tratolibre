import { describe, it, expect } from "vitest";
import { z } from "zod";

// ReviewSchema está definido localmente en reviews/actions.ts — lo replicamos acá
const ReviewSchema = z.object({
  purchase_id: z.string().uuid(),
  reviewed_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
  role: z.enum(["buyer", "seller"]),
});

const validReview = {
  purchase_id: "123e4567-e89b-12d3-a456-426614174000",
  reviewed_id: "123e4567-e89b-12d3-a456-426614174001",
  rating: 5,
  role: "buyer" as const,
};

describe("ReviewSchema", () => {
  it("acepta una review válida", () => {
    expect(ReviewSchema.safeParse(validReview).success).toBe(true);
  });

  it("acepta review con comentario", () => {
    const result = ReviewSchema.safeParse({
      ...validReview,
      comment: "Excelente vendedor",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza rating menor a 1", () => {
    const result = ReviewSchema.safeParse({ ...validReview, rating: 0 });
    expect(result.success).toBe(false);
  });

  it("rechaza rating mayor a 5", () => {
    const result = ReviewSchema.safeParse({ ...validReview, rating: 6 });
    expect(result.success).toBe(false);
  });

  it("rechaza rating decimal", () => {
    const result = ReviewSchema.safeParse({ ...validReview, rating: 4.5 });
    expect(result.success).toBe(false);
  });

  it("rechaza role inválido", () => {
    const result = ReviewSchema.safeParse({ ...validReview, role: "admin" });
    expect(result.success).toBe(false);
  });

  it("rechaza purchase_id que no es UUID", () => {
    const result = ReviewSchema.safeParse({
      ...validReview,
      purchase_id: "no-es-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza comentario mayor a 500 caracteres", () => {
    const result = ReviewSchema.safeParse({
      ...validReview,
      comment: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
