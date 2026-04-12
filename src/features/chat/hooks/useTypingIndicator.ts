// // chat/hooks/useTypingIndicator.ts
// "use client";

// import { useEffect, useRef, useState } from "react";
// import type { RealtimeChannel } from "@supabase/supabase-js";

// interface UseTypingIndicatorOptions {
//   conversationId: string;
//   userId: string;
// }

// export function useTypingIndicator({
//   conversationId,
//   userId,
// }: UseTypingIndicatorOptions) {
//   const [isOtherTyping, setIsOtherTyping] = useState(false);
//   const channelRef = useRef<RealtimeChannel | null>(null);
//   const supabaseRef = useRef<any>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

//   useEffect(() => {
//     const initTyping = async () => {
//       const { createClient } = await import("@/lib/supabase/client");
//       const supabase = createClient();
//       supabaseRef.current = supabase;

//       const channel = supabase.channel(`typing:${conversationId}`);
//       channelRef.current = channel;

//       channel
//         .on("broadcast", { event: "typing" }, ({ payload }) => {
//           if (payload.userId !== userId) {
//             setIsOtherTyping(true);
//             clearTimeout(typingTimeoutRef.current);
//             typingTimeoutRef.current = setTimeout(
//               () => setIsOtherTyping(false),
//               2000,
//             );
//           }
//         })
//         .subscribe((status) => {
//           if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
//             if (process.env.NODE_ENV === "development") {
//               console.warn("Typing channel error:", status);
//             }
//           }
//         });
//     };

//     initTyping();

//     return () => {
//       clearTimeout(typingTimeoutRef.current);
//       if (supabaseRef.current && channelRef.current) {
//         supabaseRef.current.removeChannel(channelRef.current);
//       }
//       channelRef.current = null;
//     };
//   }, [conversationId, userId]);

//   const sendTyping = () => {
//     channelRef.current?.send(
//       {
//         type: "broadcast",
//         event: "typing",
//         payload: { userId },
//       },
//       {
//         httpSend: true,
//       },
//     );
//   };

//   return { isOtherTyping, sendTyping };
// }
