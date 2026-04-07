// features/auth/actions/loginAction.ts

"use server";

import { redirect } from "next/navigation";
import { LoginSchema } from "../schemas";
import { authService } from "../services/authService";

export async function loginAction(input: { email: string; password: string }) {
  // Validación
  const parsed = LoginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Datos inválidos" };
  }

  try {
    // Llamada al service
    await authService.login(parsed.data.email, parsed.data.password);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error al iniciar sesión",
    };
  }

  // Redirección exitosa
  redirect("/");
}
