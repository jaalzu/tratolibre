import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { createNotification } from "@/features/notifications";

import { submitReviewAction } from "@/features/reviews/actions";
import { createAuthUser } from "../factories/user.factory";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/utils/auth-helpers", () => ({
  getAuthUser: vi.fn(),
}));

vi.mock("@/features/notifications", () => ({
  createNotification: vi.fn().mockResolvedValue(undefined),
}));

const validInput = {
  purchase_id: "123e4567-e89b-12d3-a456-426614174000",
  reviewed_id: "123e4567-e89b-12d3-a456-426614174001",
  rating: 5,
  role: "buyer" as const,
  comment: "Excelente vendedor",
};

const mockPurchase = {
  id: validInput.purchase_id,
  buyer_id: "test-user-id-123",
  owner_id: "123e4567-e89b-12d3-a456-426614174001",
  items: { title: "PlayStation 5" },
};

// Helper para crear un mock de Supabase que soporte encadenamiento
function createSupabaseMock() {
  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    single: vi.fn(), // El eslabón final que devolverá la data/error
  };

  const supabase = {
    from: vi.fn().mockReturnValue(builder),
  };

  return { supabase, builder };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("submitReviewAction", () => {
  it("retorna error si no hay usuario", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: {} as any,
      user: null,
    });
    const result = await submitReviewAction(validInput);
    expect(result).toEqual({ error: "No autorizado" });
  });

  it("retorna error si los datos son inválidos", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: {} as any,
      user: createAuthUser() as any,
    });
    const result = await submitReviewAction({ ...validInput, rating: 6 });
    expect(result).toEqual({ error: "Datos inválidos" });
  });

  it("retorna error si la compra no existe", async () => {
    const { supabase, builder } = createSupabaseMock();
    builder.single.mockResolvedValueOnce({ data: null, error: null });

    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });

    const result = await submitReviewAction(validInput);
    expect(result).toEqual({ error: "Compra no encontrada" });
  });

  it("retorna error si el usuario no es parte de la compra", async () => {
    const { supabase, builder } = createSupabaseMock();
    builder.single.mockResolvedValueOnce({
      data: {
        ...mockPurchase,
        buyer_id: "otro-user-id",
        owner_id: "otro-owner-id",
      },
      error: null,
    });

    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser({ id: "test-user-id-123" }) as any,
    });

    const result = await submitReviewAction(validInput);
    expect(result).toEqual({ error: "No autorizado" });
  });

  it("envía notificación y retorna success si todo es válido", async () => {
    const { supabase, builder } = createSupabaseMock();

    // Primera llamada (get purchase) -> data
    builder.single.mockResolvedValueOnce({ data: mockPurchase, error: null });
    // Segunda llamada (insert review) -> success
    builder.single.mockResolvedValueOnce({
      data: { id: "new-review-id" },
      error: null,
    });

    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser({ id: "test-user-id-123" }) as any,
    });

    // ✅ Agregá esto
    vi.mocked(createNotification).mockResolvedValueOnce(true);

    const result = await submitReviewAction(validInput);

    expect(createNotification).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });

  it("retorna error si ya existe una reseña (código 23505)", async () => {
    const { supabase, builder } = createSupabaseMock();

    // 1. Mock de búsqueda de compra (OK)
    builder.single.mockResolvedValueOnce({ data: mockPurchase, error: null });

    // 2. Mock del insert -> .select().single() (ERROR DUPLICADO)
    // No mockeamos .insert(), mockeamos el final de la cadena
    builder.single.mockResolvedValueOnce({
      data: null,
      error: { code: "23505", message: "duplicate key value" },
    });

    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser({ id: "test-user-id-123" }) as any,
    });

    const result = await submitReviewAction(validInput);
    expect(result).toEqual({ error: "Ya dejaste una reseña para esta compra" });
  });
});
