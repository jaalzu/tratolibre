import { describe, it, expect } from "vitest";
import { RegisterSchema, LoginSchema } from "@/features/auth/schemas";

describe("LoginSchema", () => {
  it("acepta email y contraseña válidos", () => {
    const result = LoginSchema.safeParse({
      email: "test@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = LoginSchema.safeParse({
      email: "no-es-un-email",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Email inválido");
  });

  it("rechaza contraseña vacía", () => {
    const result = LoginSchema.safeParse({
      email: "test@tratolibre.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("RegisterSchema", () => {
  it("acepta datos válidos", () => {
    const result = RegisterSchema.safeParse({
      firstName: "Juan",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza contraseña menor a 8 caracteres", () => {
    const result = RegisterSchema.safeParse({
      firstName: "Juan",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "123",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Mínimo 8 caracteres");
  });

  it("rechaza nombre con palabras bloqueadas", () => {
    const result = RegisterSchema.safeParse({
      firstName: "admin",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre menor a 2 caracteres", () => {
    const result = RegisterSchema.safeParse({
      firstName: "J",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre con números", () => {
    const result = RegisterSchema.safeParse({
      firstName: "Juan123",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre con más de 4 palabras", () => {
    const result = RegisterSchema.safeParse({
      firstName: "Juan Carlos Alberto Pedro Luis",
      lastName: "García",
      email: "juan@tratolibre.com",
      password: "Test1234!",
    });
    expect(result.success).toBe(false);
  });
});
