"use server";

import { registerSchema, type RegisterResponse } from "../schemas";
import { registerService } from "../services";

export async function registerAction(
  input: unknown,
): Promise<RegisterResponse> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }

  const result = await registerService(parsed.data);

  return result;
}
