// shared/hooks/useProfile.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getAuthProfile } from "@/features/profile/actions/queries/getAuthProfile";
import { getUserProfile } from "@/features/profile/actions/queries/getUserProfile";

export type AuthProfile = Awaited<ReturnType<typeof getAuthProfile>>;

export function useProfile(
  userId?: string,
  initialData?: Partial<AuthProfile> | null,
) {
  return useQuery<AuthProfile | null>({
    queryKey: ["profile", userId || "me"],

    queryFn: async () => {
      if (userId && userId !== "me") {
        const result = await getUserProfile(userId);

        if (!result || !result.profile) {
          throw new Error("Perfil no encontrado");
        }

        return result.profile as AuthProfile;
      }

      const data = await getAuthProfile();

      if (!data) {
        throw new Error("No se encontró el perfil de sesión");
      }

      return data;
    },
    initialData: initialData as AuthProfile | undefined,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}
