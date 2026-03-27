"use client";

import { useChatStore } from "@/store/chatStore";
import NavLink from "./NavLink";

interface ChatNavLinkProps {
  userId?: string;
  variant?: "desktop" | "mobile";
}

export const ChatNavLink = ({
  userId,
  variant = "desktop",
}: ChatNavLinkProps) => {
  const totalUnread = useChatStore((state) => state.totalUnread());

  return (
    <NavLink
      href="/chat"
      label="Buzón"
      icon="bx-message-square-dots"
      variant={variant}
      badge={totalUnread}
    />
  );
};
