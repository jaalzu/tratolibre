'use client'

import { Box } from '@chakra-ui/react'
import { NavbarTop } from './NavbarTop'
import { NavbarCategories } from './NavbarCategories'
import { useDisclosure } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function Navbar({ user, unreadCount = 0 }: { user: User | null; unreadCount?: number }) {
  const {  onOpen: onOpenDrawer, } = useDisclosure()
  const pathname = usePathname()
  const isChatDetail = !!pathname.match(/^\/chat\/.+/)

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={50}
      shadow="base"
      display={isChatDetail ? { base: 'none', md: 'block' } : 'block'}
    >
      <NavbarTop user={user} onOpenMenu={onOpenDrawer} unreadCount={unreadCount} />
      <NavbarCategories />
    </Box>
  )
}