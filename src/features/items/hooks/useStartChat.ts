"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateConversation } from "@/features/chat/actions";

export function useStartChat() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startChat = async (itemId: string, userId: string) => {
    if (!itemId || !userId) {
      setError("Faltan datos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getOrCreateConversation(itemId, userId);

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.data?.id) {
        router.push(`/chat/${result.data.id}`);
      }
    } catch (err) {
      setError("Error al iniciar chat");
    } finally {
      setLoading(false);
    }
  };

  return { startChat, loading, error };
}
