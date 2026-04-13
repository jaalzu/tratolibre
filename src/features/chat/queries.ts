import { keepPreviousData } from "@tanstack/react-query";
import { getMyConversations, getMessages } from "./actions";

/**
 * Query config para obtener todas las conversaciones del usuario
 */
export const conversationsQuery = {
  queryKey: ["conversations"] as const,
  queryFn: getMyConversations,
  staleTime: 1000 * 50, // 50 segundos
  gcTime: 1000 * 60 * 5, // 5 minutos
  refetchInterval: 28000, // 28 segundos
  refetchOnWindowFocus: true,
};

/**
 * Query config para obtener mensajes de una conversación específica
 */
export const messagesQuery = (conversationId: string) => ({
  queryKey: ["messages", conversationId] as const,
  queryFn: () => getMessages(conversationId),
  staleTime: 1000 * 30,
  gcTime: 1000 * 60 * 2,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  placeholderData: keepPreviousData,
});

/**
 * Query config para obtener conversaciones de un item (para vendedor)
 */
export const conversationsByItemQuery = (itemId: string) => ({
  queryKey: ["conversations", "by-item", itemId] as const,
  queryFn: () => {
    // Lazy import para evitar circular dependencies
    return import("./actions").then((m) => m.getConversationsByItem(itemId));
  },
  staleTime: 1000 * 60, // 1 minuto
  gcTime: 1000 * 60 * 5, // 5 minutos
});

/**
 * Query config para obtener una conversación específica
 */
export const conversationByIdQuery = (conversationId: string) => ({
  queryKey: ["conversation", conversationId] as const,
  queryFn: () => {
    return import("./actions").then((m) =>
      m.getConversationById(conversationId),
    );
  },
  staleTime: 1000 * 30,
  gcTime: 1000 * 60 * 2,
});

/**
 * Query config para contador de mensajes no leídos
 */
export const unreadCountQuery = {
  queryKey: ["unread-count"] as const,
  queryFn: () => {
    return import("./actions").then((m) => m.getTotalUnreadCount());
  },
  staleTime: 1000 * 30,
  gcTime: 1000 * 60 * 5,
  refetchInterval: 40000,
  refetchOnWindowFocus: true,
};
