"use client";

import { registerAction } from "../actions";
import type { RegisterInput } from "../schemas";
import { useAsyncAction } from "./useAsyncAction";

export function useRegister() {
  const { state, isPending, execute, reset, error, isSuccess } =
    useAsyncAction<RegisterInput>();

  const register = (data: RegisterInput) => {
    return execute(data, registerAction);
  };

  return {
    register,
    isPending,
    state,
    error,
    success: isSuccess,
    reset,
  };
}
