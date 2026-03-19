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
  signUpError = null,
  signOutError = null,
}: {
  signInError?: { message: string } | null;
  signUpError?: { message: string } | null;
  signOutError?: { message: string } | null;
} = {}) {
  const mock = {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: signInError }),
      signUp: vi.fn().mockResolvedValue({ error: signUpError }),
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
      password: "123456",
    });
    expect(result).toEqual({ error: "Datos inválidos" });
  });

  it("llama a signInWithPassword con las credenciales correctas", async () => {
    const supabase = mockSupabase();
    await loginAction({ email: TEST_USER.email, password: TEST_USER.password });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
  });

  it("retorna error si Supabase falla", async () => {
    mockSupabase({ signInError: { message: "Invalid credentials" } });
    const result = await loginAction({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    expect(result).toEqual({ error: "Email o contraseña incorrectos" });
  });

  it('llama a redirect("/") si login es exitoso', async () => {
    mockSupabase();
    await loginAction({ email: TEST_USER.email, password: TEST_USER.password });
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
    expect(result?.error).toBe("Mínimo 8 caracteres");
  });

  it("llama a signUp con email, password y nombre completo", async () => {
    const supabase = mockSupabase();
    await registerAction(validInput);
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: validInput.email,
      password: validInput.password,
      options: { data: { name: "Juan García" } },
    });
  });

  it("retorna error si Supabase falla", async () => {
    mockSupabase({ signUpError: { message: "Email already in use" } });
    const result = await registerAction(validInput);
    expect(result).toEqual({ error: "Email already in use" });
  });

  it('llama a redirect("/") si registro es exitoso', async () => {
    mockSupabase();
    await registerAction(validInput);
    expect(redirect).toHaveBeenCalledWith("/");
  });
});

describe("logoutAction", () => {
  it("llama a signOut", async () => {
    const supabase = mockSupabase();
    await logoutAction();
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('redirige a "/" después de logout', async () => {
    mockSupabase();
    await logoutAction();
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
