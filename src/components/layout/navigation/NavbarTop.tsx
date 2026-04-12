"use client";

import { Box, Flex, Text, Group } from "@chakra-ui/react";
import NextLink from "next/link";
import NavLink from "./NavLink";
import { ChatNavLink } from "./ChatNavLink";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { SearchBar } from "../../../features/search/components/SearchBar";
import { User } from "@supabase/supabase-js";
import {
  HomeAlt,
  PlusCircle,
  Heart,
  User as UserIcon,
  Shield,
  Categories,
} from "@boxicons/react";

const loggedNavItems = [
  { label: "Inicio", href: "/", icon: HomeAlt },
  { label: "Publicar", href: "/item/new", icon: PlusCircle },
  { label: "Favoritos", href: "/favorites", icon: Heart },
  { label: "Perfil", href: "/profile", icon: UserIcon },
];

interface NavbarTopProps {
  user: User | null;
  onOpenMenu: () => void;
  unreadCount?: number;
  isAdmin?: boolean;
}

export const NavbarTop = ({
  user,
  unreadCount = 0,
  isAdmin = false,
  onOpenMenu,
}: NavbarTopProps) => (
  <Box bg="brand.default">
    <Flex
      maxW="1280px"
      mx="auto"
      px={2}
      h="60px"
      align="center"
      gap={{ base: 2, md: 6 }}
    >
      {/* Logo */}
      <NextLink href="/" passHref>
        <Text
          display={{ base: "none", md: "block" }}
          fontWeight="bold"
          fontSize="md"
          color="neutral.50"
          whiteSpace="nowrap"
        >
          TratoLibre
        </Text>
      </NextLink>

      {/* Buscador */}
      <Group flex="1" maxW={{ base: "full", md: "700px" }}>
        <SearchBar />
      </Group>

      {/* Desktop nav */}
      <Flex align="center" gap={2} display={{ base: "none", md: "flex" }}>
        {user ? (
          <>
            {loggedNavItems.map((item) => (
              <NavLink
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                variant="desktop"
              />
            ))}
            <ChatNavLink />
            {isAdmin && (
              <NavLink
                href="/admin"
                label="Admin"
                icon={Shield}
                variant="desktop"
              />
            )}

            <Box color="neutral.50">
              <NotificationBell initialCount={unreadCount} userId={user.id} />
            </Box>
          </>
        ) : (
          <>
            <NextLink href="/register">
              <Box
                border="1px solid"
                borderColor="neutral.50"
                color="neutral.50"
                px={3}
                py={1.5}
                borderRadius="md"
                fontSize="sm"
                fontWeight="bold"
                _hover={{ bg: "whiteAlpha.200" }}
                transition="0.2s"
              >
                Regístrate o Inicia sesión
              </Box>
            </NextLink>
            <NextLink href="/register">
              <Box
                bg="neutral.50"
                color="brand.default"
                px={4}
                py={1.5}
                borderRadius="md"
                fontSize="sm"
                fontWeight="bold"
                _hover={{ bg: "neutral.100" }}
              >
                Vender
              </Box>
            </NextLink>
          </>
        )}
      </Flex>

      {/* Mobile */}
      <Box
        display={{ base: "flex", md: "none" }}
        alignItems="center"
        gap={2}
        flexShrink={0}
      >
        {user ? (
          <>
            <Box
              as="button"
              onClick={onOpenMenu}
              color="white"
              p={1}
              _hover={{ opacity: 0.8 }}
            >
              <Categories width="28px" height="28px" fill="currentColor" />
            </Box>
            <Box color="white">
              <NotificationBell initialCount={unreadCount} userId={user.id} />
            </Box>
          </>
        ) : (
          <NextLink href="/login">
            <Box
              bg="neutral.50"
              color="brand.default"
              fontSize="sm"
              fontWeight="bold"
              px={5}
              py={1}
              borderRadius="md"
            >
              Ingresar
            </Box>
          </NextLink>
        )}
      </Box>
    </Flex>
  </Box>
);
