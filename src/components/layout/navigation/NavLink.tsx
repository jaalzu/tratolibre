'use client'

import NextLink from 'next/link'
import { Flex, Text, Box } from '@chakra-ui/react'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  label: string
  icon: string
  variant?: 'desktop' | 'mobile'
}

export default function NavLink({ href, label, icon, variant = 'desktop' }: NavLinkProps) {
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
        px={isMobile ? 0 : 2} 
        gap={0} 
        _hover={{ opacity: 1 }}
        transition="0.2s"
        h="full"
        minW={isMobile ? "auto" : "60px"} 
      >
        <Box
          as="i"
          className={`bx ${icon}`}
          style={{ 
            fontSize: isMobile ? '24px' : '20px',
            color: 'var(--chakra-colors-neutral-50)',
            display: 'block',
            lineHeight: '1'
          }}
        />
        <Text 
          fontSize={isMobile ? "sm" : "10px"} 
          fontWeight={isActive ? 'bold' : 'medium'}
          color="neutral.50"
          textAlign="center"
          lineHeight="1"
          mt={isMobile ? 1 : 0.5}
        >
          {label}
        </Text>
      </Flex>
    </NextLink>
  )
}