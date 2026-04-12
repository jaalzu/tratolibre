// chat/mappers/message.mapper.ts
import {
  MessageWithProfileSchema,
  type MessageWithProfile,
} from "@/features/chat/schemas";

/**
 * Mapea mensajes crudos de la DB a MessageWithProfile[]
 */
export function mapMessagesToWithProfile(
  messages: any[],
): MessageWithProfile[] {
  return messages
    .map((msg) => {
      try {
        return MessageWithProfileSchema.parse(msg);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to map message:", msg.id, error);
        }
        return null;
      }
    })
    .filter((msg): msg is MessageWithProfile => msg !== null);
}
