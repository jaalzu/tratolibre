import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { deleteConversationAction } from "../actions";

export const useDeleteConversation = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteConversation = async (conversationId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteConversationAction(conversationId);

      if ("error" in result) {
        // ✅ Type narrowing
        console.error(result.error);
        return false;
      }

      // Limpiamos caché y navegamos
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      router.push("/chat");
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error al eliminar:", error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteConversation, isDeleting };
};
