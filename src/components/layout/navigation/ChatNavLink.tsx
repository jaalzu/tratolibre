"use client";

import { useChatStore } from "@/store/chatStore";
import NavLink from "./NavLink";
import { MessageDetail } from "@boxicons/react";

interface ChatNavLinkProps {
  userId?: string;
  variant?: "desktop" | "mobile";
}

export const ChatNavLink = ({ variant = "desktop" }: ChatNavLinkProps) => {
  const totalUnread = useChatStore((state) => state.totalUnread());

  return (
    <NavLink
      href="/chat"
      label="Buzón"
      icon={MessageDetail}
      variant={variant}
      badge={totalUnread}
    />
  );
};
