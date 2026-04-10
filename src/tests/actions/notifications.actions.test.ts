import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

vi.mock("@/lib/supabase/getAuthUser", () => ({
  getAuthUser: vi.fn(),
}));

import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/supabase/getAuthUser";
import {
  createNotification,
  getMyNotifications,
  getUnreadCount,
  markAllNotificationsRead,
} from "@/features/notifications";
import { createUser, createAuthUser } from "../factories/user.factory";
import { createNotification as createNotificationFactory } from "../factories/notification.factory";

function mockAdminClient({
  insertError = null,
}: { insertError?: { message: string } | null } = {}) {
  const builder = {
    insert: vi.fn().mockResolvedValue({ error: insertError }),
  };
  const mock = { from: vi.fn().mockReturnValue(builder) };
  vi.mocked(createAdminClient).mockReturnValue(mock as any);
  return { mock, builder };
}

function mockAuthUser(user = createAuthUser()) {
  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    update: vi.fn().mockReturnThis(),
  };
  const supabase = { from: vi.fn().mockReturnValue(builder) };
  vi.mocked(getAuthUser).mockResolvedValue({
    supabase: supabase as any,
    user: user as any,
  });
  return { supabase, builder };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createNotification", () => {
  it("inserta la notificación correctamente", async () => {
    const { builder } = mockAdminClient();
    await createNotification({
      userId: "user-123",
      type: "purchase_completed",
      data: { item_title: "PlayStation 5" },
    });
    expect(builder.insert).toHaveBeenCalledWith({
      user_id: "user-123",
      type: "purchase_completed",
      data: { item_title: "PlayStation 5" },
    });
  });

  it("loguea el error si Supabase falla", async () => {
    mockAdminClient({ insertError: { message: "RLS violation" } });
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await createNotification({
      userId: "user-123",
      type: "purchase_completed",
      data: {},
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "[createNotification] Error:",
      "RLS violation",
    );
    consoleSpy.mockRestore();
  });
});

describe("getMyNotifications", () => {
  it("retorna array vacío si no hay usuario", async () => {
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: null as any,
      user: null,
    });
    const result = await getMyNotifications();
    expect(result).toEqual([]);
  });

  it("retorna las notificaciones del usuario", async () => {
    const notifications = [
      createNotificationFactory(),
      createNotificationFactory({ id: "notification-2", read: true }),
    ];
    const { builder } = mockAuthUser();
    builder.limit.mockResolvedValue({ data: notifications, error: null });

    const result = await getMyNotifications();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("notification-id-123");
  });
});

describe("getUnreadCount", () => {
  it("retorna el count de no leídas", async () => {
    const builder = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    };
    // El último eq resuelve la promesa
    builder.eq
      .mockReturnValueOnce(builder) // primer .eq()
      .mockResolvedValueOnce({ count: 3, error: null }); // segundo .eq()

    const supabase = { from: vi.fn().mockReturnValue(builder) };
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });

    const result = await getUnreadCount();
    expect(result).toBe(3);
  });
});

describe("markAllNotificationsRead", () => {
  it("llama a update con los filtros correctos", async () => {
    const builder = {
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
    };
    builder.eq
      .mockReturnValueOnce(builder) // primer .eq()
      .mockResolvedValueOnce({ error: null }); // segundo .eq()

    const supabase = { from: vi.fn().mockReturnValue(builder) };
    vi.mocked(getAuthUser).mockResolvedValue({
      supabase: supabase as any,
      user: createAuthUser() as any,
    });

    await markAllNotificationsRead();
    expect(builder.update).toHaveBeenCalledWith({ read: true });
  });
});
