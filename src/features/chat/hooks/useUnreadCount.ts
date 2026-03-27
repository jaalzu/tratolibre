// // useUnreadCount.ts
// "use client";

// import { conversationsQuery } from "@/features/chat/queries";
// import { useQuery } from "@tanstack/react-query";

// export function useUnreadCount(userId?: string): number {
//   const { data: conversations = [] } = useQuery({
//     ...conversationsQuery,
//     enabled: !!userId,
//   });

//   return conversations.reduce((acc, conv) => acc + (conv.unreadCount ?? 0), 0);
// }
