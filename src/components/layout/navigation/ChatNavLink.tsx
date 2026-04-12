"use client";

import { useQuery } from "@tanstack/react-query";
import { conversationsQuery } from "@/features/chat/queries";
import NavLink from "./NavLink";
import { MessageDetail } from "@boxicons/react";

interface ChatNavLinkProps {
  variant?: "desktop" | "mobile";
}

export const ChatNavLink = ({ variant = "desktop" }: ChatNavLinkProps) => {
  const { data: conversations = [] } = useQuery(conversationsQuery);

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount ?? 0),
    0,
  );

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
