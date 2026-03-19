import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/getAuthUser", () => ({
  getAuthUser: vi.fn(),
}));

vi.mock("@/features/notifications/actions", () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}));

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { createNotification } from "@/features/notifications/actions";
import { submitReviewAction } from "@/features/reviews/actions";
import { createAuthUser } from "../factories/user.factory";
import { createBuilder } from "../helpers/builders";

const validInput = {
  purchase_id: "123e4567-e89b-12d3-a456-426614174000",
  reviewed_id: "123e4567-e89b-12d3-a456-426614174001",
  rating: 5,
  role: "buyer" as const,
};

const mockPurchase = {
  id: validInput.purchase_id,
  buyer_id: "test-user-id-123",
  owner_id: "123e4567-e89b-12d3-a456-426614174001",
  items: [{ title: "PlayStation 5" }],
};

function mockAuthWithPurchase(purchaseData = mockPurchase) {
  const builder = createBuilder();
  builder.single
    .mockResolvedValueOnce({ data: purchaseData, error: null }) // purchase
    .mockResolvedValueOnce({ data: null, error: null }); // insert review
  const supabase = { from: vi.fn().mockReturnValue(builder) };
  vi.mocked(getAuthUser).mockResolvedValue({
    supabase: supabase as any,
    user: createAuthUser() as any,
  });
  return { supabase, builder };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("submitReviewAction", () => {
  it("retorna error si no hay usuario", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: null as any,
      user: null,
    });
    const result = await submitReviewAction(validInput);
    expect(result).toEqual({ error: "No autorizado" });
  });

  it("retorna error si los datos son inválidos", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: null as any,
      user: createAuthUser() as any,
    });
    const result = await submitReviewAction({ ...validInput, rating: 6 });
    expect(result).toEqual({ error: "Datos inválidos" });
  });

  it("retorna error si la compra no existe", async () => {
    const builder = createBuilder();
    builder.single.mockResolvedValueOnce({ data: null, error: null });
    const supabase = { from: vi.fn().mockReturnValue(builder) };
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });
    const result = await submitReviewAction(validInput);
    expect(result).toEqual({ error: "Compra no encontrada" });
  });

  it("retorna error si el usuario no es parte de la compra", async () => {
    const builder = createBuilder();
    builder.single.mockResolvedValueOnce({
      data: {
        ...mockPurchase,
        buyer_id: "otro-user-id",
        owner_id: "otro-owner-id",
      },
      error: null,
    });
    const supabase = { from: vi.fn().mockReturnValue(builder) };
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });
    const result = await submitReviewAction(validInput);
    expect(result).toEqual({ error: "No autorizado" });
  });

  it("retorna error si el reviewed_id no corresponde a la compra", async () => {
    const builder = createBuilder();
    builder.single.mockResolvedValueOnce({
      data: {
        ...mockPurchase,
        buyer_id: "test-user-id-123",
        owner_id: "otro-owner-id", // reviewed_id no coincide
      },
      error: null,
    });
    const supabase = { from: vi.fn().mockReturnValue(builder) };
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });
    const result = await submitReviewAction(validInput);
    expect(result).toEqual({ error: "Reseña inválida" });
  });

  it("envía notificación y retorna success si todo es válido", async () => {
    const builder = createBuilder();
    builder.single
      .mockResolvedValueOnce({ data: mockPurchase, error: null }) // purchase
      .mockResolvedValueOnce({ data: null, error: null }); // insert review ok
    const supabase = { from: vi.fn().mockReturnValue(builder) };
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });

    const result = await submitReviewAction(validInput);
    expect(createNotification).toHaveBeenCalledOnce();
    expect(result).toEqual({ success: true });
  });

  it("retorna error si ya existe una reseña (código 23505)", async () => {
    const builder = createBuilder();
    // purchase ok
    builder.single.mockResolvedValueOnce({ data: mockPurchase, error: null });
    // insert review → error duplicado — insert resuelve directamente, no con single
    builder.insert.mockResolvedValueOnce({
      data: null,
      error: { code: "23505", message: "duplicate" },
    });

    const supabase = { from: vi.fn().mockReturnValue(builder) };
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });

    const result = await submitReviewAction(validInput);
    expect(result).toEqual({ error: "Ya dejaste una reseña para esta compra" });
  });
});
