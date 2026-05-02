import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ============================================
// MOCKS - DEBEN IR ANTES DE LOS IMPORTS
// ============================================

// ✅ Mock de ItemsService con función factory
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockMarkAsSold = vi.fn();
const mockToggleAvailability = vi.fn();

vi.mock("@/lib/supabase/services", () => ({
  ItemsService: vi.fn().mockImplementation(() => ({
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    markAsSold: mockMarkAsSold,
    toggleAvailability: mockToggleAvailability,
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/utils/auth-helpers", () => ({
  getAuthUser: vi.fn(),
}));

vi.mock("@/lib/supabase/client/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/utils/rate-limiter", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(undefined),
  RATE_LIMITS: {
    CREATE_ITEM: { max: 10, windowMin: 60 },
  },
}));

vi.mock("@/features/notifications", () => ({
  createNotification: vi.fn().mockResolvedValue(true),
}));

// ============================================
// IMPORTS - DESPUÉS DE LOS MOCKS
// ============================================

import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { createClient } from "@/lib/supabase/client/server";
import { createNotification } from "@/features/notifications";
import {
  createItemAction,
  deleteItemAction,
  markAsSoldToAction,
  toggleFavoriteAction,
} from "@/features/items/actions";
import { createAuthUser } from "../factories/user.factory";
import { createItem } from "../factories/item.factory";

// ============================================
// HELPERS
// ============================================

function createBuilder(resolvedValue: object = { data: null, error: null }) {
  const builder = {} as Record<string, ReturnType<typeof vi.fn>>;

  builder.select = vi.fn().mockReturnValue(builder);
  builder.insert = vi.fn().mockReturnValue(builder);
  builder.update = vi.fn().mockReturnValue(builder);
  builder.delete = vi.fn().mockReturnValue(builder);
  builder.eq = vi.fn().mockReturnValue(builder);
  builder.order = vi.fn().mockReturnValue(builder);
  builder.limit = vi.fn().mockReturnValue(builder);
  builder.ilike = vi.fn().mockReturnValue(builder);
  builder.gte = vi.fn().mockReturnValue(builder);
  builder.lte = vi.fn().mockReturnValue(builder);
  builder.single = vi.fn().mockResolvedValue(resolvedValue);

  Object.defineProperty(builder, Symbol.toStringTag, { value: "Promise" });

  return builder;
}

function mockAuthUser(user = createAuthUser(), builderOverrides = {}) {
  const builder = { ...createBuilder(), ...builderOverrides };
  const supabase = { from: vi.fn().mockReturnValue(builder) };

  vi.mocked(getAuthUser).mockResolvedValue({
    supabase: supabase as any,
    user: user as any,
  });

  return { supabase, builder };
}

function makeFormData(fields: Record<string, string | string[]>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (Array.isArray(value)) {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, value);
    }
  }
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ============================================
// TESTS - createItemAction
// ============================================

describe("createItemAction", () => {
  const validFormData = makeFormData({
    title: "PlayStation 5 usado",
    description:
      "Consola en perfecto estado con dos controles y todos los cables.",
    category: "juegos",
    condition: "good",
    sale_price: "150000",
    province: "Buenos Aires",
    city: "CABA",
    images: ["https://example.com/image.jpg"],
  });

  it("retorna error si no hay usuario autenticado", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: null as any,
      user: null,
    });

    const result = await createItemAction(null, validFormData);

    expect(result).toEqual({
      success: false,
      error: "No autorizado",
    });
  });

  it("inserta el item y redirige si todo es válido", async () => {
    const user = createAuthUser();
    const item = createItem({ id: "item-123", owner_id: user.id });

    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: {} as any,
      user: user as any,
    });

    vi.mocked(createClient).mockResolvedValue({} as any);

    // ✅ Mock: ItemsService.create retorna DTO
    mockCreate.mockResolvedValue({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      salePrice: item.sale_price,
      province: item.province,
      city: item.city,
      condition: item.condition,
      images: item.images || [],
      ownerId: user.id,
      available: true,
      sold: false,
      viewsCount: 0,
      createdAt: new Date(),
      updatedAt: null,
      soldAt: null,
    });

    await createItemAction(null, validFormData);

    expect(mockCreate).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(`/item/${item.id}`);
  });
});

// ============================================
// TESTS - deleteItemAction
// ============================================

describe("deleteItemAction", () => {
  it("retorna error si no hay usuario", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: null as any,
      user: null,
    });

    const result = await deleteItemAction("item-123");

    expect(result).toEqual({
      success: false,
      error: "No autorizado",
    });
  });

  it("elimina el item y redirige a /", async () => {
    const user = createAuthUser();

    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: {} as any,
      user: user as any,
    });

    vi.mocked(createClient).mockResolvedValue({} as any);

    mockDelete.mockResolvedValue(undefined);

    await deleteItemAction("item-123");

    expect(mockDelete).toHaveBeenCalledWith("item-123", user.id);
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("retorna error si ItemsService falla", async () => {
    const user = createAuthUser();

    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: {} as any,
      user: user as any,
    });

    vi.mocked(createClient).mockResolvedValue({} as any);

    mockDelete.mockRejectedValue(new Error("Database error"));

    const result = await deleteItemAction("item-123");

    expect(result).toEqual({
      success: false,
      error: "Ocurrió un error inesperado. Intentá de nuevo.",
    });
  });
});

// ============================================
// TESTS - markAsSoldToAction
// ============================================

describe("markAsSoldToAction", () => {
  it("retorna error si no hay usuario", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: null as any,
      user: null,
    });

    const result = await markAsSoldToAction("item-123", "buyer-123");

    expect(result).toEqual({
      success: false,
      error: "No autorizado", // ✅ Mensaje correcto
    });
  });

  it("retorna error si el item no existe", async () => {
    mockAuthUser(createAuthUser(), {
      single: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    });

    const result = await markAsSoldToAction("item-123", "buyer-123");

    expect(result).toEqual({
      success: false,
      error: "El item que buscás no existe o fue eliminado", // ✅ Mensaje correcto
    });
  });

  it("crea purchase y envía dos notificaciones si todo es válido", async () => {
    const item = createItem({
      id: "item-123",
      owner_id: "user-123",
      sale_price: 1000,
      title: "Test Item",
    });

    const purchaseId = "purchase-123";

    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "items") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { sale_price: item.sale_price, title: item.title },
                    error: null,
                  }),
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }),
          };
        }

        if (table === "purchases") {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: purchaseId },
                  error: null,
                }),
              }),
            }),
          };
        }

        return createBuilder();
      }),
    };

    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: mockSupabase as any,
      user: { id: "user-123" } as any,
    });

    const result = await markAsSoldToAction(item.id, "buyer-123");

    expect(createNotification).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      success: true,
      data: { purchaseId: "purchase-123" },
    });
  });
});

// ============================================
// TESTS - toggleFavoriteAction
// ============================================

describe("toggleFavoriteAction", () => {
  it("retorna error si no hay usuario", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: null as any,
      user: null,
    });

    const result = await toggleFavoriteAction("item-123");

    expect(result).toEqual({ error: "No autorizado" }); // ✅ Mensaje correcto
  });

  it("agrega a favoritos si no existe", async () => {
    const builder = createBuilder();
    builder.single.mockResolvedValueOnce({ data: null, error: null });
    builder.insert.mockResolvedValueOnce({ error: null });
    const supabase = { from: vi.fn().mockReturnValue(builder) };

    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });

    const result = await toggleFavoriteAction("item-123");

    expect(result).toEqual({ favorited: true });
  });
});
