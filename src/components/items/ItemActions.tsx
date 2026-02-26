'use client'

import { useState } from 'react'
import { getOrCreateConversation } from '@/features/chat/actions'
import { useRouter } from 'next/navigation'
import {  Text, Flex } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import NextLink from 'next/link'

export default function ItemActions({ item, userId }: { item: any, userId: string | null }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAction(type: 'buy' | 'offer') {
    if (!userId) return router.push('/login')
    setLoading(true)
    const result = await getOrCreateConversation(item.id, item.profiles?.id)
    if (result.data) {
      router.push(`/chat/${result.data.id}?type=${type}`)
    }
    setLoading(false)
  }

  if (!userId) return (
    <Button asChild width="full" py={1}>
      <NextLink href="/login">Iniciá sesión para contactar</NextLink>
    </Button>
  )

  if (item.profiles?.id === userId) return (
    <Text fontSize="sm" color="neutral.400" textAlign="center">Este es tu artículo</Text>
  )

  if (item.sold) return (
    <Text fontSize="sm" color="feedback.error" fontWeight="bold" textAlign="center">Vendido</Text>
  )
return (
 <Flex gap={3} direction={{ base: "row", md: "column" }}>
  <Button flex="1" borderRadius="2xl" py={{ base: 2, md: 1 }} onClick={() => handleAction('buy')} loading={loading}>
    Comprar
  </Button>
  <Button flex="1" borderRadius="2xl" py={{ base: 2, md: 1 }} variant="secondary" onClick={() => handleAction('offer')} loading={loading}>
    Hacer oferta
  </Button>
</Flex>
)
}