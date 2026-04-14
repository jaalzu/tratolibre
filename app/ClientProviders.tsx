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

  // ✅ Suprimir warnings de hydration en consola
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("Hydration")) {
        return;
      }
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

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
