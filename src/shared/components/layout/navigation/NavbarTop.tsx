"use client";

import { Box, Flex, Group, Image } from "@chakra-ui/react";
import NextLink from "next/link";
import NavLink from "./NavLink";
import { ChatNavLink } from "./ChatNavLink";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { SearchBar } from "@/features/search/components/SearchBar";
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
    {/* Desktop Layout */}
    <Flex
      maxW="1280px"
      mx="auto"
      px={2}
      h="60px"
      align="center"
      gap={{ base: 2, md: 3 }}
      display={{ base: "none", md: "flex" }}
    >
      {/* Logo Desktop — oculto < 1000px para dar espacio al search */}
      <Box
        display={{ base: "none", lg: "block" }}
        flexShrink={0}
        css={{
          "@media (max-width: 999px)": { display: "none" },
          "@media (min-width: 1000px)": { display: "block" },
        }}
      >
        <NextLink href="/" passHref aria-label="Ir al inicio de TratoLibre">
          <Image src="/koala/logotextwhite.webp" alt="TratoLibre" h="31px" />
        </NextLink>
      </Box>

      {/* Buscador */}
      <Group
        flex="1"
        minW={0}
        css={{
          "@media (max-width: 999px)": {
            marginLeft: "var(--chakra-spacing-6)",
          },
          "@media (min-width: 1000px)": { marginLeft: "0" },
        }}
      >
        <SearchBar />
      </Group>

      {/* Desktop nav */}
      <Flex align="center" gap={1} flexShrink={0}>
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
              <Box ml={1}>
                <NavLink
                  href="/admin"
                  label="Admin"
                  icon={Shield}
                  variant="desktop"
                />
              </Box>
            )}
            <Box ml={1} color="neutral.50">
              <NotificationBell initialCount={unreadCount} userId={user.id} />
            </Box>
            <Box
              as="button"
              onClick={onOpenMenu}
              aria-label="Abrir categorías"
              color="neutral.50"
              px={2}
              py={1.5}
              _hover={{ bg: "rgba(255,255,255,0.08)" }}
              borderRadius="md"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
            >
              <Categories width="24px" height="24px" fill="currentColor" />
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
                _hover={{ bg: "rgba(255,255,255,0.08)" }}
                transition="0.2s"
              >
                Regístrate o Inicia sesión
              </Box>
            </NextLink>
            <NextLink href="/register">
              <Box
                bg="neutral.50"
                border="1px solid"
                borderColor="neutral.50"
                color="black"
                px={5}
                py={1.5}
                borderRadius="md"
                fontSize="sm"
                fontWeight="bold"
                _hover={{ bg: "rgba(255,255,255,0.85)" }}
              >
                Vender
              </Box>
            </NextLink>
          </>
        )}
      </Flex>
    </Flex>

    {/* Mobile Layout */}
    <Box display={{ base: "block", md: "none" }}>
      {/* Single Row: Logo + Search + Bell + Categories */}
      <Flex px={2} py={2.5} align="center" gap={2}>
        <NextLink href="/" passHref aria-label="Ir al inicio de TratoLibre">
          <Box flexShrink={0}>
            <Image src="/koala/logo.webp" alt="TratoLibre" h="35px" />
          </Box>
        </NextLink>

        <Group flex="1">
          <SearchBar />
        </Group>

        {user ? (
          <Flex align="center" gap={1} flexShrink={0}>
            <Box color="white">
              <NotificationBell initialCount={unreadCount} userId={user.id} />
            </Box>
            <Box
              as="button"
              onClick={onOpenMenu}
              aria-label="Abrir categorías"
              color="white"
              px={2}
              py={1.5}
              _hover={{ bg: "rgba(255,255,255,0.08)" }}
              borderRadius="md"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
            >
              <Categories width="28px" height="28px" fill="currentColor" />
            </Box>
          </Flex>
        ) : (
          <NextLink href="/login">
            <Box
              bg="neutral.50"
              color="black"
              fontSize="sm"
              fontWeight="bold"
              px={5}
              py={1.5}
              borderRadius="2px"
              transition="all 0.2s ease"
              _hover={{
                bg: "brand.100",
              }}
            >
              Ingresar
            </Box>
          </NextLink>
        )}
      </Flex>
    </Box>
  </Box>
);
