// chat/schemas.ts
import { z } from "zod";

// ============================================================================
// CUSTOM VALIDATORS
// ============================================================================

/**
 * Valida timestamps de Supabase (con o sin microsegundos)
 * Acepta: "2024-01-01T12:00:00Z" y "2024-01-01T12:00:00.123456+00:00"
 */
const supabaseTimestamp = z
  .string()
  .nullable()
  .refine(
    (val) => {
      if (val === null) return true;
      // Regex más permisivo para timestamps de Supabase
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(
        val,
      );
    },
    { message: "Invalid timestamp format" },
  );

// ============================================================================
// SCHEMAS BASE (DB boundaries)
// ============================================================================

export const ProfileBaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  avatar_url: z.string().url().nullable(),
  bio: z.string().nullable(),
  location: z.string().nullable(),
  province: z.string().nullable(),
  phone: z.string().nullable(),
  rating: z.number().nullable(),
  reviews_count: z.number().int().nonnegative().nullable(),
  role: z.string(),
  verified: z.boolean().nullable(),
  created_at: supabaseTimestamp,
  updated_at: supabaseTimestamp,
});

export const MessageRowSchema = z.object({
  id: z.string().uuid(),
  conversation_id: z.string().uuid().nullable(),
  sender_id: z.string().uuid(),
  content: z.string().min(1).max(1000),
  read: z.boolean().nullable().default(false),
  created_at: supabaseTimestamp,
});

export const ConversationRowSchema = z.object({
  id: z.string().uuid(),
  item_id: z.string().uuid().nullable(),
  buyer_id: z.string().uuid().nullable(),
  seller_id: z.string().uuid().nullable(),
  created_at: supabaseTimestamp,
  updated_at: supabaseTimestamp,
});

// ============================================================================
// SCHEMAS EXTENDIDOS (con relaciones y campos calculados)
// ============================================================================

export const ProfilePublicSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  avatar_url: z.string().url().nullable(),
});

export const ItemSummarySchema = z.object({
  title: z.string(),
  images: z.array(z.string().url()),
  sale_price: z.number().nonnegative(),
});

export const LastMessageSchema = z.object({
  content: z.string(),
  created_at: supabaseTimestamp.transform(
    (val) => val ?? new Date().toISOString(),
  ),
});

export const MessageWithProfileSchema = MessageRowSchema.extend({
  profiles: ProfilePublicSchema.nullable().optional(),
});

export const ConversationSummarySchema = z.object({
  id: z.string().uuid().nullable(),
  item_id: z.string().uuid().nullable(),
  buyer_id: z.string().uuid().nullable(),
  seller_id: z.string().uuid().nullable(),
  created_at: supabaseTimestamp,
  updated_at: supabaseTimestamp,
  last_message_content: z.string().nullable(),
  last_message_at: supabaseTimestamp,
  buyer: z.any().nullable(),
  seller: z.any().nullable(),
  items: z.any().nullable(),
});

export const ConversationExtendedSchema = ConversationSummarySchema.extend({
  hasUnread: z.boolean().optional(),
  unreadCount: z.number().int().nonnegative().optional(),
  lastMessage: LastMessageSchema.nullable().optional(),
  items: ItemSummarySchema.optional(),
  buyer: ProfilePublicSchema.optional(),
  seller: ProfilePublicSchema.optional(),
});

export const ConversationBuyerSchema = z.object({
  id: z.string().uuid(),
  buyer_id: z.string().uuid(),
  buyer: z.array(ProfilePublicSchema).nullable(),
});

// ============================================================================
// INPUT SCHEMAS (validación de entrada en actions)
// ============================================================================

export const SendMessageInputSchema = z.object({
  conversationId: z.string().uuid("ID de conversación inválido"),
  content: z
    .string()
    .min(1, "El mensaje no puede estar vacío")
    .max(1000, "Máximo 1000 caracteres")
    .transform((val) => val.trim()),
});

export const CreateConversationInputSchema = z.object({
  itemId: z.string().uuid("ID de publicación inválido"),
  sellerId: z.string().uuid("ID de vendedor inválido"),
});

export const ConversationIdSchema = z.object({
  conversationId: z.string().uuid("ID de conversación inválido"),
});

export const ItemIdSchema = z.object({
  itemId: z.string().uuid("ID de publicación inválido"),
});

// ============================================================================
// RESPONSE SCHEMAS (validación de salida de server)
// ============================================================================

export const ActionSuccessSchema = z.object({
  success: z.literal(true),
});

export const ActionErrorSchema = z.object({
  error: z.string(),
});

export const ActionResponseSchema = z.union([
  ActionSuccessSchema,
  ActionErrorSchema,
]);

export const ConversationDataResponseSchema = z.union([
  z.object({ data: ConversationRowSchema }),
  ActionErrorSchema,
]);

export const MessagesArraySchema = z.array(MessageWithProfileSchema);

export const ConversationsArraySchema = z.array(ConversationExtendedSchema);

export const ConversationsByItemSchema = z.array(ConversationBuyerSchema);

// ============================================================================
// TYPE EXPORTS (inferidos de schemas)
// ============================================================================

export type ProfileBase = z.infer<typeof ProfileBaseSchema>;
export type ProfilePublic = z.infer<typeof ProfilePublicSchema>;
export type MessageRow = z.infer<typeof MessageRowSchema>;
export type ConversationRow = z.infer<typeof ConversationRowSchema>;
export type MessageWithProfile = z.infer<typeof MessageWithProfileSchema>;
export type ConversationSummary = z.infer<typeof ConversationSummarySchema>;
export type ConversationExtended = z.infer<typeof ConversationExtendedSchema>;
export type ConversationBuyer = z.infer<typeof ConversationBuyerSchema>;
export type ItemSummary = z.infer<typeof ItemSummarySchema>;
export type LastMessage = z.infer<typeof LastMessageSchema>;

// Input types
export type SendMessageInput = z.infer<typeof SendMessageInputSchema>;
export type CreateConversationInput = z.infer<
  typeof CreateConversationInputSchema
>;
export type ConversationIdInput = z.infer<typeof ConversationIdSchema>;
export type ItemIdInput = z.infer<typeof ItemIdSchema>;

// Response types
export type ActionResponse = z.infer<typeof ActionResponseSchema>;
export type ActionSuccess = z.infer<typeof ActionSuccessSchema>;
export type ActionError = z.infer<typeof ActionErrorSchema>;
export type ConversationDataResponse = z.infer<
  typeof ConversationDataResponseSchema
>;
