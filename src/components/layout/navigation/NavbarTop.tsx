'use client'

import { Box, Flex, Text, Group, IconButton } from '@chakra-ui/react'
import NextLink from 'next/link'
import { logoutAction } from '@/features/auth/actions'
import NavLink from './NavLink'
import 'boxicons/css/boxicons.min.css'
import { ChatNavLink } from './ChatNavLink'
import { NotificationBell } from '@/features/notifications/components/NotificationBell'
import { SearchBar } from '../../../features/search/components/SearchBar'
import { User } from '@supabase/supabase-js'

const loggedNavItems = [
  { label: 'Inicio',    href: '/',          icon: 'bx-home-alt'    },
  { label: 'Publicar',  href: '/item/new',  icon: 'bx-plus-circle' },
  { label: 'Favoritos', href: '/favorites', icon: 'bx-heart'       },
  { label: 'Perfil',    href: '/profile',   icon: 'bx-user'        },
]

interface NavbarTopProps {
  user:         User | null
  onOpenMenu:   () => void
  unreadCount?: number
}

export const NavbarTop = ({ user, unreadCount = 0 }: NavbarTopProps) => (
  <Box bg="brand.default">
    <Flex maxW="1280px" mx="auto" px={2} h="60px" align="center" gap={{ base: 2, md: 6 }}>

      {/* Logo */}
      <NextLink href="/" passHref>
        <Text fontWeight="bold" fontSize="md" color="neutral.50" whiteSpace="nowrap">
          TratoLibre
        </Text>
      </NextLink>

      {/* Buscador */}
      <Group flex="1" maxW={{ base: 'full', md: '700px' }}>
        <SearchBar />
      </Group>

      {/* Desktop nav */}
      <Flex align="center" gap={2} display={{ base: 'none', md: 'flex' }}>
        {user ? (
          <>
            {loggedNavItems.map((item) => (
              <NavLink key={item.label} href={item.href} label={item.label} icon={item.icon} variant="desktop" />
            ))}
            <ChatNavLink userId={user.id} />
            <Box color="neutral.50">
              <NotificationBell initialCount={unreadCount} userId={user.id} />
            </Box>
            <form action={logoutAction}>
              <IconButton type="submit" p={1} variant="ghost" color="neutral.50" _hover={{ bg: 'whiteAlpha.200' }}>
       <i className='bx bx-log-out' style={{ fontSize: '28px' }} />
              </IconButton>
            </form>
          </>
        ) : (
          <>
            <NextLink href="/register">
              <Box border="1px solid" borderColor="neutral.50" color="neutral.50" px={3} py={1.5} borderRadius="md" fontSize="sm" fontWeight="bold" _hover={{ bg: 'whiteAlpha.200' }} transition="0.2s">
                Regístrate o Inicia sesión
              </Box>
            </NextLink>
            <NextLink href="/register">
              <Box bg="neutral.50" color="brand.default" px={4} py={1.5} borderRadius="md" fontSize="sm" fontWeight="bold" _hover={{ bg: 'neutral.100' }} shadow="base">
                Vender
              </Box>
            </NextLink>
          </>
        )}
      </Flex>

      {/* Mobile: campana o login */}
      <Box display={{ base: 'flex', md: 'none' }} flexShrink={0}>
        {user ? (
          <Box color="white">
            <NotificationBell initialCount={unreadCount} userId={user.id} />
          </Box>
        ) : (
          <NextLink href="/login">
            <Box bg="neutral.50" color="brand.default" fontSize="sm" fontWeight="bold" px={3} py={1} borderRadius="md">
              Ingresar
            </Box>
          </NextLink>
        )}
      </Box>

    </Flex>
  </Box>
)