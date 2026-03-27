import { create } from "zustand";
import { Conversation } from "@/features/chat/types";

interface ChatStore {
  conversations: Conversation[];
  isLoading: boolean;
  setConversations: (convs: Conversation[]) => void;
  setLoading: (loading: boolean) => void;
  totalUnread: () => number;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  isLoading: true,
  setConversations: (conversations) => set({ conversations }),
  setLoading: (isLoading) => set({ isLoading }),
  totalUnread: () =>
    get().conversations.reduce((acc, conv) => acc + (conv.unreadCount ?? 0), 0),
}));
