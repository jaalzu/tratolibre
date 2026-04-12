import { create } from "zustand";
import type { ConversationExtended } from "@/features/chat/schemas";

interface ChatStore {
  conversations: ConversationExtended[];
  setConversations: (conversations: ConversationExtended[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  totalUnread: () => number;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  loading: true,
  setLoading: (loading) => set({ loading }),

  // Calcula el total de mensajes no leídos
  totalUnread: () => {
    const conversations = get().conversations;
    return conversations.reduce(
      (sum, conv) => sum + (conv.unreadCount ?? 0),
      0,
    );
  },
}));
