"use server";

import { redirect } from "next/navigation";
import { loginServerSchema, type LoginResponse } from "../schemas";
import { loginService } from "../services";

export async function loginAction(input: unknown): Promise<LoginResponse> {
  const parsed = loginServerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Usuario o contraseña incorrecta",
    };
  }

  const result = await loginService(parsed.data);

  if (!result.success) {
    return result;
  }

  redirect("/");
}
