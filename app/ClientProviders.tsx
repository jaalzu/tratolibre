"use client";

import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChatStoreInit = dynamic(
  () =>
    import("@/features/chat/components/ChatStoreInit").then(
      (mod) => mod.ChatStoreInit,
    ),
  { ssr: false },
);

export function ClientProviders({
  children,
  userId,
}: {
  children: ReactNode;
  userId?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {userId && mounted && <ChatStoreInit userId={userId} />}
      {children}
    </>
  );
}
