import { useRef, useCallback } from "react";

export function useScrollToBottom() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  return { bottomRef, scrollToBottom };
}
