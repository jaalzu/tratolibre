// __tests__/auth/schemas.test.ts

import { describe, it, expect } from "vitest";
import {
  loginSchema, // ✅ Cambió el nombre
  registerSchema, // ✅ Cambió el nombre
  loginServerSchema, // ✅ Nuevo schema
} from "@/features/auth/schemas";

describe("loginSchema (form)", () => {
  it("acepta email y contraseña válidos", () => {
    const result = loginSchema.safeParse({
      email: "test@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = loginSchema.safeParse({
      email: "no-es-un-email",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Email inválido");
  });

  it("rechaza contraseña vacía", () => {
    const result = loginSchema.safeParse({
      email: "test@tratolibre.com",
      password: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("La contraseña es requerida");
  });

  // ✅ NUEVO: Test para password corta (acepta en form)
  it("acepta contraseña de 4 caracteres en el form", () => {
    const result = loginSchema.safeParse({
      email: "test@tratolibre.com",
      password: "1234",
    });
    expect(result.success).toBe(true); // ✅ Form es más permisivo
  });
});

// ✅ NUEVO: Tests para loginServerSchema
describe("loginServerSchema (server)", () => {
  it("acepta contraseña de 8+ caracteres", () => {
    const result = loginServerSchema.safeParse({
      email: "test@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza contraseña menor a 8 caracteres", () => {
    const result = loginServerSchema.safeParse({
      email: "test@tratolibre.com",
      password: "1234",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "La contraseña debe tener al menos 8 caracteres",
    );
  });
});

describe("registerSchema", () => {
  it("acepta datos válidos", () => {
    const result = registerSchema.safeParse({
      firstName: "Juan",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza contraseña menor a 8 caracteres", () => {
    const result = registerSchema.safeParse({
      firstName: "Juan",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "La contraseña debe tener al menos 8 caracteres",
    );
  });

  // ✅ NUEVO: Test para regex de password
  it("rechaza contraseña sin mayúsculas, minúsculas y números", () => {
    const result = registerSchema.safeParse({
      firstName: "Juan",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "testtest", // Sin mayúscula ni número
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Debe contener mayúsculas, minúsculas y números",
    );
  });

  it("rechaza nombre con palabras bloqueadas", () => {
    const result = registerSchema.safeParse({
      firstName: "admin",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre menor a 2 caracteres", () => {
    const result = registerSchema.safeParse({
      firstName: "J",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre con números", () => {
    const result = registerSchema.safeParse({
      firstName: "Juan123",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre con más de 4 palabras", () => {
    const result = registerSchema.safeParse({
      firstName: "Juan Carlos Alberto Pedro Luis",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
  });
});
