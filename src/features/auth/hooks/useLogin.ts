"use client";

import { loginAction } from "../actions";
import type { LoginInput } from "../schemas";
import { useAsyncAction } from "./useAsyncAction";

// useLogin.ts
export function useLogin() {
  // ✅ Ahora es void porque login no retorna data
  const { state, isPending, execute, reset, error } = useAsyncAction<
    LoginInput,
    void
  >();

  const login = (data: LoginInput) => {
    return execute(data, loginAction);
  };

  return {
    login,
    isPending,
    state,
    error,
    clearError: reset,
  };
}
