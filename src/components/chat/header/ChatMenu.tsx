'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import NextLink from 'next/link'
import 'boxicons/css/boxicons.min.css'

interface ChatMenuProps {
  itemId: string
  conversationId: string
}

export const ChatMenu = ({ itemId, conversationId }: ChatMenuProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const options = [
    { label: 'Ver publicación', icon: 'bx-link-external', href: `/item/${itemId}` },
    { label: 'Reportar usuario', icon: 'bx-flag', color: 'feedback.error' },
    { label: 'Eliminar conversación', icon: 'bx-trash', color: 'feedback.error' },
  ]

  return (
    <Box position="relative" ref={ref}>
      <Box
        cursor="pointer"
        p="1"
        borderRadius="md"
        _hover={{ bg: 'whiteAlpha.200' }}
        onClick={() => setOpen(!open)}
      >
        <i className="bx bx-dots-vertical-rounded" style={{ fontSize: '22px', color: 'white' }} />
      </Box>

      {open && (
        <Box
          position="absolute"
          right="0"
          top="36px"
          bg="white"
          borderRadius="xl"
          shadow="lg"
          border="1px solid"
          borderColor="neutral.100"
          zIndex={50}
          minW="200px"
          overflow="hidden"
        >
          {options.map((opt) => (
            opt.href ? (
              <NextLink key={opt.label} href={opt.href} onClick={() => setOpen(false)}>
                <Flex
                  align="center" gap="3" px="4" py="3"
                  _hover={{ bg: 'neutral.50' }}
                  cursor="pointer"
                >
                  <i className={`bx ${opt.icon}`} style={{ fontSize: '16px', color: 'var(--chakra-colors-neutral-500)' }} />
                  <Text fontSize="sm" color="neutral.700">{opt.label}</Text>
                </Flex>
              </NextLink>
            ) : (
              <Flex
                key={opt.label}
                align="center" gap="3" px="4" py="3"
                _hover={{ bg: 'neutral.50' }}
                cursor="pointer"
                onClick={() => setOpen(false)}
              >
                <i className={`bx ${opt.icon}`} style={{ fontSize: '16px', color: 'var(--chakra-colors-feedback-error)' }} />
                <Text fontSize="sm" color="feedback.error">{opt.label}</Text>
              </Flex>
            )
          ))}
        </Box>
      )}
    </Box>
  )
}