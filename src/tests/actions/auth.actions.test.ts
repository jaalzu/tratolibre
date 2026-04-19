import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de next/navigation — redirect no puede ejecutarse en tests
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock de createClient — interceptamos antes de que la action lo importe
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginAction,
  registerAction,
  logoutAction,
} from "@/features/auth/actions";
import { TEST_USER } from "../constants";

// Helper para crear el mock de supabase con comportamiento configurable
function mockSupabase({
  signInError = null,
  signInData = { user: { id: "123", email: "test@test.com" } }, // ✅ Agregado data
  signUpError = null,
  signUpData = { user: { id: "456", email: "test@test.com" } }, // ✅ Agregado data
  signOutError = null,
}: {
  signInError?: { message: string } | null;
  signInData?: any;
  signUpError?: { message: string } | null;
  signUpData?: any;
  signOutError?: { message: string } | null;
} = {}) {
  const mock = {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        error: signInError,
        data: signInError ? null : signInData, // ✅ Devuelve data si no hay error
      }),
      signUp: vi.fn().mockResolvedValue({
        error: signUpError,
        data: signUpError ? null : signUpData, // ✅ Devuelve data si no hay error
      }),
      signOut: vi.fn().mockResolvedValue({ error: signOutError }),
    },
  };
  vi.mocked(createClient).mockResolvedValue(mock as any);
  return mock;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("loginAction", () => {
  it("retorna error si el email es inválido", async () => {
    const result = await loginAction({
      email: "no-es-email",
      password: "ValidPass123",
    });
    expect(result).toEqual({
      success: false,
      error: "Usuario o contraseña incorrecta",
    });
  });

  it("llama a signInWithPassword con las credenciales correctas", async () => {
    const supabase = mockSupabase();

    try {
      await loginAction({
        email: TEST_USER.email,
        password: TEST_USER.password,
      });
    } catch (error) {
      // redirect tira error, es normal
    }

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
  });

  it("retorna error si Supabase falla", async () => {
    mockSupabase({
      signInError: { message: "Invalid login credentials" },
      signInData: null,
    });

    const result = await loginAction({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });

    expect(result).toEqual({
      success: false,
      error: "Email o contraseña incorrectos",
    });
  });

  it('llama a redirect("/") si login es exitoso', async () => {
    mockSupabase();

    try {
      await loginAction({
        email: TEST_USER.email,
        password: TEST_USER.password,
      });
    } catch (error) {}

    expect(redirect).toHaveBeenCalledWith("/");
  });
});

describe("registerAction", () => {
  const validInput = {
    firstName: "Juan",
    lastName: "García",
    email: TEST_USER.email,
    password: TEST_USER.password,
  };

  it("retorna error si la contraseña es muy corta", async () => {
    const result = await registerAction({ ...validInput, password: "123" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(
        "La contraseña debe tener al menos 8 caracteres",
      );
    }
  });

  it("retorna error si la contraseña no cumple regex", async () => {
    const result = await registerAction({
      ...validInput,
      password: "testtest",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(
        "Debe contener mayúsculas, minúsculas y números",
      );
    }
  });

  it("llama a signUp con email, password y nombre completo", async () => {
    const supabase = mockSupabase();
    await registerAction(validInput);

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: validInput.email,
      password: validInput.password,
      options: {
        emailRedirectTo: expect.stringContaining("/auth/callback"),
        data: {
          first_name: "Juan",
          last_name: "García",
          name: "Juan García",
        },
      },
    });
  });

  it("retorna error si el email ya está registrado", async () => {
    mockSupabase({
      signUpError: { message: "User already registered" },
      signUpData: null,
    });

    const result = await registerAction(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Este email ya está registrado");
    }
  });

  it("retorna error genérico si Supabase falla con otro error", async () => {
    mockSupabase({
      signUpError: { message: "Unknown error" },
      signUpData: null,
    });

    const result = await registerAction(validInput);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(
        "Error al crear la cuenta. Intenta nuevamente.",
      );
    }
  });

  it("retorna success si registro es exitoso", async () => {
    mockSupabase();
    const result = await registerAction(validInput);

    expect(result.success).toBe(true);
  });
});

describe("logoutAction", () => {
  it("llama a signOut", async () => {
    const supabase = mockSupabase();

    try {
      await logoutAction();
    } catch (error) {}

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('redirige a "/login" después de logout', async () => {
    mockSupabase();

    try {
      await logoutAction();
    } catch (error) {
      // redirect tira error
    }

    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
