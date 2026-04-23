"use client";

import { logoutAction } from "../actions";
import { useAsyncAction } from "./useAsyncAction";

export function useLogout() {
  const { isPending, execute } = useAsyncAction<void>();

  const logout = () => {
    return execute(undefined as void, async () => {
      await logoutAction();
      return { success: true };
    });
  };

  return {
    logout,
    isPending,
  };
}
