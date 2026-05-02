"use server";

import { getAuthUser } from "@/lib/supabase/utils/auth-helpers";
import { checkRateLimit } from "@/lib/rateLimit";
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
    // 1. Validación de input (incluye trim y límite de caracteres)
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
    const [allowed, accessResult] = await Promise.all([
      checkRateLimit(supabase, user.id, "send_message", 30, 1),
      verifyConversationAccess(
        supabase,
        validatedInput.conversationId,
        user.id,
      ),
    ]);

    // 4. Validaciones de negocio
    if (!allowed) {
      return {
        error: "Estás enviando mensajes muy rápido, esperá un momento",
      };
    }

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

    // 6. Actualizar timestamp (non-blocking)
    const { error: updateError } = await updateConversationTimestamp(
      supabase,
      validatedInput.conversationId,
    );

    // Log pero no bloqueamos si falla
    if (updateError && process.env.NODE_ENV === "development") {
      console.error("Error updating conversation timestamp:", updateError);
    }

    return { success: true };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in sendMessageAction:", error);
    }
    return { error: "Error inesperado al enviar el mensaje" };
  }
}
