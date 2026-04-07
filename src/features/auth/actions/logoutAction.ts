// features/auth/actions/logoutAction.ts

"use server";

import { redirect } from "next/navigation";
import { authService } from "../services/authService";

export async function logoutAction() {
  try {
    await authService.logout();
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }

  redirect("/");
}
