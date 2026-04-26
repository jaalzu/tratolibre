"use server";

import { getAuthUser } from "@/lib/supabase/getAuthUser";
import {
  findExistingConversation,
  createConversation,
} from "@/features/chat/services/conversations.service";
import { mapSupabaseError } from "@/lib/supabase/errorMapper";
import {
  CreateConversationInputSchema,
  ConversationRowSchema,
  type ConversationDataResponse,
} from "@/features/chat/schemas";

export async function getOrCreateConversation(
  itemId: string,
  sellerId: string,
): Promise<ConversationDataResponse> {
  try {
    const validatedInput = CreateConversationInputSchema.parse({
      itemId,
      sellerId,
    });

    const { supabase, user } = await getAuthUser();
    if (!user) {
      return { error: "No autorizado" };
    }

    if (user.id === validatedInput.sellerId) {
      return { error: "No podés chatear con vos mismo" };
    }

    const { data: existing, error: findError } = await findExistingConversation(
      supabase,
      validatedInput.itemId,
      user.id,
    );

    if (existing) {
      const validated = ConversationRowSchema.parse(existing);
      return { data: validated };
    }

    const { data, error } = await createConversation(
      supabase,
      validatedInput.itemId,
      user.id,
      validatedInput.sellerId,
    );

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    if (!data) {
      return { error: "No se pudo crear la conversación" };
    }

    const validated = ConversationRowSchema.parse(data);
    return { data: validated };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Unexpected error in getOrCreateConversation:", error);
    }
    return { error: "Error inesperado al crear la conversación" };
  }
}
