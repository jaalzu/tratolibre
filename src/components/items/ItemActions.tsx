'use client'

import { useState } from 'react'
import { getOrCreateConversation } from '@/features/chat/actions'
import { useRouter } from 'next/navigation'
import { Text } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import NextLink from 'next/link'

export default function ItemActions({ item, userId }: { item: any, userId: string | null }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleContact() {
    if (!userId) return router.push('/login')
    setLoading(true)
    const result = await getOrCreateConversation(item.id, item.profiles?.id)
    if (result.data) router.push(`/chat/${result.data.id}`)
    setLoading(false)
  }

  if (!userId) return (
    <Button asChild width="full" py={1}>
      <NextLink href="/login">Iniciá sesión para contactar</NextLink>
    </Button>
  )

  if (item.profiles?.id === userId) return (
    <Text fontSize="lg" color="neutral.400" textAlign="center">Este es tu artículo</Text>
  )

  if (item.sold) return (
    <Text fontSize="lg" color="feedback.error" fontWeight="bold" textAlign="center">Vendido</Text>
  )

  return (
    <Button width="full"  borderRadius="2xl" bg="accent.default" py={1.5} onClick={handleContact} loading={loading}>
      Contactar vendedor
    </Button>
  )
}