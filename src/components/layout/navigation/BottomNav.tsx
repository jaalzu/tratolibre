'use client'

import { Box, Grid } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import NavLink from './NavLink'
import { ChatNavLink } from './ChatNavLink'

interface BottomNavProps {
  userId?: string
    isAdmin?: boolean
}

const navItems = [
  { label: 'Inicio', href: '/', icon: 'bx-home-alt' },
  { label: 'Favoritos', href: '/favorites', icon: 'bx-heart' },
  { label: 'Publicar', href: '/item/new', icon: 'bx-plus-circle' },
  { label: 'Buzón', href: '/chat', icon: 'bx-message-square-dots', isChat: true },
  { label: 'Perfil', href: '/profile', icon: 'bx-user' },
]

export default function BottomNav({ userId, isAdmin = false }: BottomNavProps) {
  if (!userId) return null

  const pathname = usePathname()

  if (pathname.startsWith('/chat/')) return null

  return (
    <Box
      display={{ base: 'block', md: 'none' }}
      position="fixed" bottom={0} left={0} right={0}
      bg="brand.default" zIndex={100} px={2}
      boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
    >
      <Grid 
   templateColumns="repeat(auto-fit, minmax(0, 1fr))"

  h="60px" 
  gap={0} 
  justifyItems="center" 
  alignItems="center"
>
        {navItems.map((item) =>
          item.isChat
            ? <ChatNavLink key={item.label} userId={userId} variant="mobile" />
            : <NavLink key={item.label} href={item.href} label={item.label} icon={item.icon} variant="mobile" />
        )}
        {isAdmin && (
          <NavLink href="/admin" label="Admin" icon="bx-shield" variant="mobile" />
        )}
      </Grid>
      <Box h="safe-bottom" bg="brand.default" />
    </Box>
  )
}