"use client";

import { loginAction } from "../actions";
import type { LoginInput } from "../schemas";
import { useAsyncAction } from "./useAsyncAction";

export function useLogin() {
  const { state, isPending, execute, reset, error } =
    useAsyncAction<LoginInput>();

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
