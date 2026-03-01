'use client'

import { Box, Flex, Text, Input, Group, IconButton } from '@chakra-ui/react'
import NextLink from 'next/link'
import { logoutAction } from '@/features/auth/actions'
import NavLink from './NavLink'
import 'boxicons/css/boxicons.min.css'
import { ChatNavLink } from './ChatNavLink'

const loggedNavItems = [
  { label: 'Inicio', href: '/', icon: 'bx-home-alt' },
  { label: 'Publicar', href: '/item/new', icon: 'bx-plus-circle' },
  { label: 'Favoritos', href: '/favorites', icon: 'bx-heart' },
  { label: 'Perfil', href: '/dashboard', icon: 'bx-user' },
]

interface NavbarTopProps {
  user: any
  onOpenMenu: () => void
}

export const NavbarTop = ({ user, onOpenMenu }: NavbarTopProps) => (
  <Box bg="brand.default">
    <Flex maxW="1280px" mx="auto" px={3} h="60px" align="center" justify="space-between" gap={1}>
      <NextLink href="/" passHref>
        <Text fontWeight="bold" fontSize="md" color="neutral.50" whiteSpace="nowrap">TratoLibre</Text>
      </NextLink>

      <Group flex="1" maxW={{ base: "full", md: "600px" }}>
        <Box position="relative" w="full">
          <Box position="absolute" left="3" top="50%" transform="translateY(-40%)" zIndex={10}>
            <i className='bx bx-search' style={{ color: 'var(--chakra-colors-neutral-300)', fontSize: '20px' }}></i>
          </Box>
          <Input
            placeholder="Buscar..." ps="10" h="32px" fontSize="sm"
            bg="neutral.50" color="neutral.900" borderRadius="full" border="none"
            _focus={{ shadow: "focus" }}
          />
        </Box>
      </Group>

      <Flex align="center" gap={2} display={{ base: "none", md: "flex" }}>
        {user ? (
          <>
            {loggedNavItems.map((item) => (
              <NavLink key={item.label} href={item.href} label={item.label} icon={item.icon} variant="desktop" />
            ))}
            <ChatNavLink userId={user.id} />
            <form action={logoutAction}>
              <IconButton type="submit" p={1} variant="ghost" color="red" _hover={{ bg: "whiteAlpha.200" }}>
                <i className='bx bx-log-out' style={{ fontSize: '24px' }}></i>
              </IconButton>
            </form>
          </>
        ) : (
          <>
            <NextLink href="/register">
              <Box border="1px solid" borderColor="neutral.50" color="neutral.50" px={3} py={1.5} borderRadius="md" fontSize="sm" fontWeight="bold" _hover={{ bg: "whiteAlpha.200" }} transition="0.2s">
                Regístrate o Inicia sesión
              </Box>
            </NextLink>
            <NextLink href="/register">
              <Box bg="neutral.50" color="brand.default" px={4} py={1.5} borderRadius="md" fontSize="sm" fontWeight="bold" _hover={{ bg: "neutral.100" }} shadow="base">
                Vender
              </Box>
            </NextLink>
          </>
        )}
      </Flex>

      <IconButton display={{ base: "flex", md: "none" }} variant="ghost" size="sm" color="neutral.50" onClick={onOpenMenu}>
        <i className='bx bx-category' style={{ fontSize: '28px' }}></i>
      </IconButton>
    </Flex>
  </Box>
)