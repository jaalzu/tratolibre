"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import {
  checkRateLimit,
  RateLimitError,
} from "@/lib/supabase/utils/rate-limiter";
import {
  verifyConversationAccess,
  updateConversationTimestamp,
} from "@/features/chat/services/conversations.service";
import { insertMessage } from "@/features/chat/services/messages.service";
import { mapSupabaseError } from "@/lib/supabase/core/errors";
import {
  SendMessageInputSchema,
  type ActionResponse,
} from "@/features/chat/schemas";

export async function sendMessageAction(
  conversationId: string,
  content: string,
): Promise<ActionResponse> {
  try {
    // 1. Validación de input
    const validatedInput = SendMessageInputSchema.parse({
      conversationId,
      content,
    });

    // 2. Auth
    const { supabase, user } = await getAuthUser();
    if (!user) {
      return { error: "No autorizado" };
    }

    // 3. Rate limiting + verificación de acceso (parallel)
    // Nota: Si checkRateLimit lanza error, el Promise.all cae al catch principal
    const [_, accessResult] = await Promise.all([
      checkRateLimit(supabase, user.id, "send_message", {
        max: 30,
        windowMin: 1,
      }),
      verifyConversationAccess(
        supabase,
        validatedInput.conversationId,
        user.id,
      ),
    ]);

    // 4. Validaciones de negocio
    if (accessResult.error) {
      return { error: mapSupabaseError(accessResult.error) };
    }

    if (!accessResult.data) {
      return {
        error: "Conversación no encontrada o no tenés acceso a ella",
      };
    }

    // 5. Insertar mensaje
    const { error: msgError } = await insertMessage(
      supabase,
      validatedInput.conversationId,
      user.id,
      validatedInput.content,
    );

    if (msgError) {
      return { error: mapSupabaseError(msgError) };
    }

    // 6. Actualizar timestamp
    const { error: updateError } = await updateConversationTimestamp(
      supabase,
      validatedInput.conversationId,
    );

    if (updateError && process.env.NODE_ENV === "development") {
      console.error("Error updating conversation timestamp:", updateError);
    }

    return { success: true };
  } catch (error) {
    if (error instanceof RateLimitError) {
      return {
        error: "Estás enviando mensajes muy rápido, esperá un momento",
      };
    }

    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in sendMessageAction:", error);
    }

    return { error: "Error inesperado al enviar el mensaje" };
  }
}
