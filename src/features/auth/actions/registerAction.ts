// features/auth/actions/registerAction.ts

"use server";

import { RegisterSchema } from "../schemas";
import { authService } from "../services/authService";

export async function registerAction(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  // Validación
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    // Llamada al service
    await authService.register(parsed.data);
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Error al registrar usuario",
    };
  }
}
