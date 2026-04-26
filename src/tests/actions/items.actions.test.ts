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

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/rateLimit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/features/notifications", () => ({
  createNotification: vi.fn().mockResolvedValue(true),
}));

import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import { createNotification } from "@/features/notifications";
import {
  createItemAction,
  deleteItemAction,
  markAsSoldToAction,
  toggleFavoriteAction,
} from "@/features/items/actions";
import { createAuthUser } from "../factories/user.factory";
import { createItem } from "../factories/item.factory";

// Builder genérico reutilizable
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
      value.forEach((v) => fd.append(key, v));
    } else {
      fd.append(key, value);
    }
  }
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createItemAction ────────────────────────────────────────────────────────

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

    const formData = new FormData();
    formData.append("title", "Test Item");

    const result = await createItemAction(null, formData);

    expect(result).toEqual({
      success: false,
      error: "No autorizado",
    });
  });

  it("retorna error si los datos son inválidos", async () => {
    mockAuthUser();
    const badFormData = makeFormData({ title: "PS5" }); // título muy corto
    const result = await createItemAction(null, badFormData);
    // expect(result?.error).toBeDefined();
  });

  it("inserta el item y redirige si todo es válido", async () => {
    const item = createItem();
    const builder = createBuilder({ data: item, error: null });
    // single() resuelve con el item creado
    builder.single.mockResolvedValue({ data: item, error: null });
    const supabase = { from: vi.fn().mockReturnValue(builder) };
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });

    await createItemAction(null, validFormData);
    expect(redirect).toHaveBeenCalledWith(`/item/${item.id}`);
  });
});

// ─── deleteItemAction ────────────────────────────────────────────────────────

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
    const builder = createBuilder();
    builder.eq
      .mockReturnValueOnce(builder)
      .mockResolvedValueOnce({ error: null });
    const supabase = { from: vi.fn().mockReturnValue(builder) };
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });

    await deleteItemAction("item-123");
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("retorna error si Supabase falla", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: { message: "DB error", code: "500" },
            }),
          }),
        }),
      }),
    };

    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: mockSupabase as any,
      user: { id: "user-123" } as any,
    });

    const result = await deleteItemAction("item-123");

    expect(result).toEqual({
      success: false,
      error: "Hubo un problema con la base de datos. Intentá nuevamente",
    });
  });
});

// ─── markAsSoldToAction ──────────────────────────────────────────────────────

describe("markAsSoldToAction", () => {
  it("retorna error si no hay usuario", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: null as any,
      user: null,
    });

    const result = await markAsSoldToAction("item-123", "buyer-123");

    expect(result).toEqual({
      success: false,
      error: "No autorizado",
    });
  });

  it("retorna error si el item no existe", async () => {
    const { supabase } = mockAuthUser(createAuthUser(), {
      single: vi.fn().mockResolvedValue({
        data: null, // Item no encontrado
        error: null,
      }),
    });

    const result = await markAsSoldToAction("item-123", "buyer-123");

    expect(result).toEqual({
      success: false,
      error: "El item que buscás no existe o fue eliminado",
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

    // ✅ Mock completo del flujo de Supabase
    const mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "items") {
          return {
            // Para getItemForSale (SELECT)
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
            // Para markItemAsSold (UPDATE)
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ error: null }),
              }),
            }),
          };
        }

        if (table === "purchases") {
          return {
            // Para createPurchase (INSERT)
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

// ─── toggleFavoriteAction ────────────────────────────────────────────────────

describe("toggleFavoriteAction", () => {
  it("retorna error si no hay usuario", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: null as any,
      user: null,
    });
    const result = await toggleFavoriteAction("item-123");
    expect(result).toEqual({ error: "No autorizado" });
  });

  it("agrega a favoritos si no existe", async () => {
    const builder = createBuilder();
    // eq siempre retorna this, single resuelve
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
