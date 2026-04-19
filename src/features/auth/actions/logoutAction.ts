// features/auth/actions/logout.action.ts

"use server";

import { redirect } from "next/navigation";
import { logoutService } from "../services";

export async function logoutAction(): Promise<void> {
  await logoutService();

  redirect("/login");
}
