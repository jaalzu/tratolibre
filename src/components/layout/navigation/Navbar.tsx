'use client'

import { Box } from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { NavbarTop } from './NavbarTop'
import { NavbarCategories } from './NavbarCategories'
import { CategorySidebar } from './CategorySidebar'
import { MobileDrawer } from './MobileDrawer'
import { usePathname } from 'next/navigation'

export default function Navbar({ user }: { user: any }) {
  const { open, onOpen, onClose } = useDisclosure()
  const { open: openCats, onOpen: onOpenCats, onClose: onCloseCats } = useDisclosure()
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
      <NavbarTop user={user} onOpenMenu={onOpen} />
      <NavbarCategories onOpenCats={onOpenCats} />
      <CategorySidebar open={openCats} onClose={onCloseCats} />
      <MobileDrawer open={open} onClose={onClose} user={user} />
    </Box>
  )
}