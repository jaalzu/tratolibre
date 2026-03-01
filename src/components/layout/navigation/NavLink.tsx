'use client'

import NextLink from 'next/link'
import { Flex, Text, Box } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  label: string
  icon: string
  variant?: 'desktop' | 'mobile'
  badge?: number
}

export default function NavLink({ href, label, icon, variant = 'desktop', badge = 0 }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  const isMobile = variant === 'mobile'
  
  return (
    <NextLink 
      href={href} 
      style={{ 
        textDecoration: 'none', 
        display: 'flex',
        height: '100%',
        width: isMobile ? '100%' : 'auto' 
      }}
    >
      <Flex 
        direction="column" 
        align="center" 
        justify="center"
        w={isMobile ? "100%" : "auto"} 
        minW={isMobile ? "auto" : "64px"}
        h="full"
        px={isMobile ? 0 : 2} 
        _hover={{ opacity: 0.8, bg: isMobile ? 'transparent' : 'whiteAlpha.50' }} 
        transition="0.2s"
        cursor="pointer"
        position="relative"
      >
        <Box position="relative" display="inline-flex">
          <Box
            as="i"
            className={`bx ${icon}`}
            style={{ 
              fontSize: isMobile ? '24px' : '24px', 
              color: 'var(--chakra-colors-neutral-50)', 
              display: 'block', 
              lineHeight: '1' 
            }}
          />
          
          {badge > 0 && (
            <Box
              position="absolute" 
              top="-3px" 
              right="-7px"
              bg="red.500" 
              color="white" 
              borderRadius="full"
              minW="15px" 
              h="15px" 
              fontSize="9px" 
              fontWeight="bold"
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              lineHeight="1" 
              zIndex={1}
            >
              {badge > 9 ? '9+' : badge}
            </Box>
          )}
        </Box>

        <Text 
          fontSize={isMobile ? "sm" : "xs"} 
          fontWeight={isActive ? 'bold' : 'medium'}
          color="neutral.50" 
          textAlign="center" 
          lineHeight="1.1"
          mt={isMobile ? 1 : 0.5}
        >
          {label}
        </Text>
      </Flex>
    </NextLink>
  )
}