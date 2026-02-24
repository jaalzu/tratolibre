'use client'

import { Flex, Text, Box, Grid } from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Inicio', href: '/', icon: 'bx-home-alt' },
    { label: 'Favoritos', href: '/favorites', icon: 'bx-heart' },
    { label: 'Publicar', href: '/object/new', icon: 'bx-plus-circle' },
    { label: 'Buzón', href: '/dashboard/messages', icon: 'bx-message-square-dots' },
    { label: 'Perfil', href: '/dashboard', icon: 'bx-user' },
  ]

  return (
    <Box 
      display={{ base: 'block', md: 'none' }} 
      position="fixed" 
      bottom={0} 
      left={0} 
      right={0} 
      bg="brand.default" 
      zIndex={100}
      px={2}
      boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
    >
      {/* Grid de 5 columnas iguales para que "Tu" no se desplace */}
     <Grid templateColumns="repeat(5, 1fr)" h="60px" gap={0}> {/* gap 0 para asegurar */}
  {navItems.map((item) => {
    const isActive = pathname === item.href
    
    return (
      <NextLink 
        key={item.label} 
        href={item.href} 
        style={{ 
          textDecoration: 'none', 
          display: 'flex', 
          width: '100%' 
        }}
      >
        <Flex 
          direction="column" 
          align="center" 
          justify="center"
          w="full" 
          h="full"
        >
          <i 
            className={`bx ${item.icon}`} 
            style={{ 
              fontSize: '24px', 
              color: 'var(--chakra-colors-neutral-50)',
              display: 'block' 
            }}
          ></i>
          <Text 
            fontSize="sm" 
            fontWeight={isActive ? 'bold' : 'medium'}
            color="neutral.50"
            lineHeight="1" 
            mt={1}
          >
            {item.label}
          </Text>
        </Flex>
      </NextLink>
    )
  })}
</Grid>
      <Box h="safe-bottom" bg="brand.default" />
    </Box>
  )
}