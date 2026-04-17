// features/auth/hooks/useLogout.ts

"use client";

import { useTransition } from "react";
import { logoutAction } from "../actions";

/**
 * Hook: useLogout
 *
 * Maneja el cierre de sesión
 * Súper simple porque logout nunca falla
 */
export function useLogout() {
  const [isPending, startTransition] = useTransition();

  const logout = () => {
    startTransition(async () => {
      await logoutAction();
      // El action hace redirect automáticamente
    });
  };

  return {
    logout,
    isPending,
  };
}
