'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@/lib/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 10, // 10 segundos
        refetchOnWindowFocus: false,
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        {children}
      </ChakraProvider>
    </QueryClientProvider>
  )
}