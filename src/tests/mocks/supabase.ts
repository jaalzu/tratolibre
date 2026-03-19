import { vi } from "vitest";

// Builder reutilizable para mockear respuestas de Supabase
export function createSupabaseMock({
  data = null,
  error = null,
  count = null,
}: {
  data?: unknown;
  error?: unknown;
  count?: number | null;
} = {}) {
  const response = { data, error, count };

  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(response),
    head: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    then: vi.fn().mockResolvedValue(response),
  };

  // Cuando termina la cadena sin .single()
  Object.assign(builder.select, { mockResolvedValue: () => response });
  builder.eq.mockResolvedValue(response);
  builder.order.mockResolvedValue(response);

  return {
    from: vi.fn().mockReturnValue(builder),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi
          .fn()
          .mockResolvedValue({ data: { path: "test.jpg" }, error: null }),
        getPublicUrl: vi
          .fn()
          .mockReturnValue({
            data: { publicUrl: "https://example.com/test.jpg" },
          }),
      }),
    },
    _builder: builder, // expuesto para aserciones en tests
  };
}

export type SupabaseMock = ReturnType<typeof createSupabaseMock>;
