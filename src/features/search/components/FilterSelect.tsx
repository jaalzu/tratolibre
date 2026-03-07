'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import 'boxicons/css/boxicons.min.css'

interface Option {
  id:    string
  label: string
}

interface FilterSelectProps {
  value:       string
  onChange:    (value: string) => void
  options:     Option[]
  placeholder: string
}

export function FilterSelect({ value, onChange, options, placeholder }: FilterSelectProps) {
  const [open, setOpen]   = useState(false)
  const ref               = useRef<HTMLDivElement>(null)
  const selected          = options.find(o => o.id === value)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <Box position="relative" ref={ref}>
      <Flex
        as="button"
        w="full"
        align="center"
        justify="space-between"
        px={3} h="38px"
        border="1px solid" borderColor={open ? 'brand.default' : 'neutral.200'}
        borderRadius="lg"
        bg="white"
        cursor="pointer"
        onClick={() => setOpen(o => !o)}
        transition="border-color 0.15s"
      >
        <Text fontSize="sm" color={selected ? 'neutral.900' : 'neutral.400'} 
  overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" flex={1}>
  {selected ? selected.label : placeholder}
</Text>
        <i
          className={open ? 'bx bx-chevron-up' : 'bx bx-chevron-down'}
          style={{ fontSize: '18px', color: 'var(--chakra-colors-neutral-400)', flexShrink: 0 }}
        />
      </Flex>

      {open && (
        <Box
          position="absolute" top="calc(100% + 4px)" left={0} right={0}
          bg="white" border="1px solid" borderColor="neutral.200"
          borderRadius="lg" boxShadow="md" zIndex={50}
          maxH="220px" overflowY="auto"
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': { borderRadius: '100px', background: '#c1c1c1' },
          }}
        >
          <Box
            as="button" w="full" textAlign="left" px={3} py={2}
            _hover={{ bg: 'neutral.50' }}
            onClick={() => { onChange(''); setOpen(false) }}
          >
            <Text fontSize="sm" color="neutral.400">{placeholder}</Text>
          </Box>
          {options.map(opt => (
            <Box
              key={opt.id}
              as="button" w="full" textAlign="left" px={3} py={2}
              bg={value === opt.id ? 'brand.50' : 'transparent'}
              _hover={{ bg: value === opt.id ? 'brand.50' : 'neutral.50' }}
              onClick={() => { onChange(opt.id); setOpen(false) }}
            >
              <Flex align="center" justify="space-between">
                <Text fontSize="sm" color={value === opt.id ? 'brand.default' : 'neutral.700'}
                  fontWeight={value === opt.id ? 'bold' : 'normal'}>
                  {opt.label}
                </Text>
                {value === opt.id && (
                  <i className="bx bx-check" style={{ fontSize: '16px', color: 'var(--chakra-colors-brand-default)' }} />
                )}
              </Flex>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}