"use client";

import { Box, Grid, Flex } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import NavLink from "./NavLink";
import { ChatNavLink } from "./ChatNavLink";
import { PublishFab } from "./PublishFab";
import { HomeAlt, Heart, MessageDetail, User, Shield } from "@boxicons/react";

interface BottomNavProps {
  userId?: string;
  isAdmin?: boolean;
}

export default function BottomNav({ userId, isAdmin = false }: BottomNavProps) {
  const pathname = usePathname();

  if (pathname.startsWith("/chat/")) return null;

  const isPublishActive = pathname === "/item/new";
  const publishHref = userId ? "/item/new" : "/login";

  return (
    <Box
      display={{ base: "block", md: "none" }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="brand.default"
      zIndex={100}
      px={1}
      pb="env(safe-area-inset-bottom)"
      boxShadow="0 -4px 18px rgba(0,0,0,0.14), 0 -1px 4px rgba(0,0,0,0.08)"
      overflow="visible"
    >
      <Grid
        templateColumns={
          isAdmin && userId ? "repeat(6, 1fr)" : "repeat(5, 1fr)"
        }
        h="62px"
        alignItems="center"
        position="relative"
        overflow="visible"
        pb="2px"
      >
        {/* 1. Inicio */}
        <NavLink href="/" label="Inicio" icon={HomeAlt} variant="mobile" />

        {/* 2. Favoritos */}
        <NavLink
          href={userId ? "/favorites" : "/login"}
          label="Favoritos"
          icon={Heart}
          variant="mobile"
        />

        {/* 3. FAB Central: Publicar — wrapper keeps Grid cell but FAB protrudes via absolute */}
        <Flex
          justify="center"
          align="center"
          h="full"
          position="relative"
          overflow="visible"
        >
          <PublishFab href={publishHref} isActive={isPublishActive} />
        </Flex>

        {/* 4. Buzón */}
        {userId ? (
          <ChatNavLink variant="mobile" />
        ) : (
          <NavLink
            href="/login"
            label="Buzón"
            icon={MessageDetail}
            variant="mobile"
          />
        )}

        {/* 5. Perfil */}
        <NavLink
          href={userId ? "/profile" : "/login"}
          label="Perfil"
          icon={User}
          variant="mobile"
        />

        {/* 6. Admin (si aplica) */}
        {isAdmin && userId && (
          <NavLink href="/admin" label="Admin" icon={Shield} variant="mobile" />
        )}
      </Grid>
    </Box>
  );
}
