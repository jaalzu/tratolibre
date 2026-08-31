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
      pb="calc(env(safe-area-inset-bottom) + 0px)"
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
        <Flex pb="8px">
          <NavLink href="/" label="Inicio" icon={HomeAlt} variant="mobile" />
        </Flex>

        {/* 2. Favoritos */}
        <Flex pb="8px">
          <NavLink
            href={userId ? "/favorites" : "/login"}
            label="Favoritos"
            icon={Heart}
            variant="mobile"
          />
        </Flex>

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
        <Flex pb="8px">
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
        </Flex>

        {/* 5. Perfil */}
        <Flex pb="8px">
          <NavLink
            href={userId ? "/profile" : "/login"}
            label="Perfil"
            icon={User}
            variant="mobile"
          />
        </Flex>

        {/* 6. Admin (si aplica) */}
        {isAdmin && userId && (
          <Flex pb="8px">
            <NavLink
              href="/admin"
              label="Admin"
              icon={Shield}
              variant="mobile"
            />
          </Flex>
        )}
      </Grid>
    </Box>
  );
}
