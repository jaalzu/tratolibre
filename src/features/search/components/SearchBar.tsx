'use client'

import { Box, Input } from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import 'boxicons/css/boxicons.min.css'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('keywords') ?? '')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || !query.trim()) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('keywords', query.trim())
    router.push(`/search?${params.toString()}`)
  }

  return (
    <Box position="relative" w="full">
      <Box position="absolute" left="3" top="50%" transform="translateY(-40%)" zIndex={10}>
        <i className='bx bx-search' style={{ color: 'var(--chakra-colors-neutral-300)', fontSize: '18px' }} />
      </Box>
      <Input
        placeholder="Buscar..."
        ps="9" h="32px" fontSize="sm"
        bg="neutral.50" color="neutral.900"
        borderRadius="full" border="none"
        _focus={{ shadow: 'focus' }}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </Box>
  )
}