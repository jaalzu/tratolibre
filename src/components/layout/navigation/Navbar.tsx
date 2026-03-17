"use client";

import { Box } from "@chakra-ui/react";
import { NavbarTop } from "./NavbarTop";
import { CategoriesDrawer } from "@/components/layout/navigation/CategoriesDrawer";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Navbar({
  user,
  unreadCount = 0,
  isAdmin = false,
}: {
  user: User | null;
  unreadCount?: number;
  isAdmin?: boolean;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const isChatDetail = !!pathname.match(/^\/chat\/.+/);

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={50}
      display={isChatDetail ? { base: "none", md: "block" } : "block"}
    >
      <NavbarTop
        user={user}
        onOpenMenu={() => setDrawerOpen(true)}
        unreadCount={unreadCount}
        isAdmin={isAdmin}
      />

      <CategoriesDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
}
