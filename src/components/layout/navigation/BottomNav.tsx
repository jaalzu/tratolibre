"use client";

import { Box, Grid } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import NavLink from "./NavLink";
import { ChatNavLink } from "./ChatNavLink";
import {
  HomeAlt,
  Heart,
  PlusCircle,
  MessageDetail,
  User,
  Shield,
} from "@boxicons/react";

interface BottomNavProps {
  userId?: string;
  isAdmin?: boolean;
}

const navItems = [
  { label: "Inicio", href: "/", icon: HomeAlt, protected: false },
  { label: "Favoritos", href: "/favorites", icon: Heart, protected: true },
  { label: "Publicar", href: "/item/new", icon: PlusCircle, protected: true },
  {
    label: "Buzón",
    href: "/chat",
    icon: MessageDetail,
    isChat: true,
    protected: true,
  },
  { label: "Perfil", href: "/profile", icon: User, protected: true },
];

export default function BottomNav({ userId, isAdmin = false }: BottomNavProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/chat/")) return null;

  return (
    <Box
      display={{ base: "block", md: "none" }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="brand.default"
      zIndex={100}
      px={2}
      boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
    >
      <Grid
        templateColumns="repeat(auto-fit, minmax(0, 1fr))"
        h="60px"
        alignItems="center"
      >
        {navItems.map((item) =>
          item.isChat ? (
            userId ? (
              <ChatNavLink key={item.label} userId={userId} variant="mobile" />
            ) : (
              <NavLink
                key={item.label}
                href="/login"
                label={item.label}
                icon={item.icon} // Ahora pasamos el componente
                variant="mobile"
              />
            )
          ) : (
            <NavLink
              key={item.label}
              href={item.protected && !userId ? "/login" : item.href}
              label={item.label}
              icon={item.icon} // Ahora pasamos el componente
              variant="mobile"
            />
          ),
        )}
        {isAdmin && userId && (
          <NavLink href="/admin" label="Admin" icon={Shield} variant="mobile" />
        )}
      </Grid>
    </Box>
  );
}
