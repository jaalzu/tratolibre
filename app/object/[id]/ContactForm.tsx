'use client'

import { useState } from 'react'
import { getOrCreateConversation } from '@/features/conversations/actions'
import { useRouter } from 'next/navigation'
import { Box, Text, Stack, Flex } from '@chakra-ui/react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import NextLink from 'next/link'

export default function ContactForm({ object, userId }: { object: any, userId: string | null }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAction(type: 'buy' | 'offer') {
    if (!userId) return router.push('/login')
    setLoading(true)
    const result = await getOrCreateConversation(object.id, object.profiles?.id)
    if (result.data) {
      router.push(`/dashboard/messages?conversation=${result.data.id}&type=${type}`)
    }
    setLoading(false)
  }

  const priceContent = (
    <Text fontSize="3xl" fontWeight="bold" color="neutral.900">
      ${object.sale_price?.toLocaleString('es-AR')}
    </Text>
  )

  if (!userId) {
    return (
      <Card p={5}>
        <Stack gap={3} align="center">
          {priceContent}
          <Text fontSize="sm" color="neutral.400" textAlign="center">
            Iniciá sesión para contactar al vendedor
          </Text>
          <Button asChild width="full">
            <NextLink href="/login">Iniciar sesión</NextLink>
          </Button>
        </Stack>
      </Card>
    )
  }

  if (object.profiles?.id === userId) {
    return (
      <Card p={5}>
        <Stack gap={1} align="center">
          {priceContent}
          <Text fontSize="sm" color="neutral.400" mt={4}>
            Este es tu objeto
          </Text>
        </Stack>
      </Card>
    )
  }

  if (object.sold) {
    return (
      <Card p={5}>
        <Stack gap={2} align="center">
          {priceContent}
          <Text fontSize="sm" color="feedback.error" fontWeight="bold">
            Este objeto ya fue vendido
          </Text>
        </Stack>
      </Card>
    )
  }

  return (
    <Card p={5}>
      <Stack gap={4}>
        <Box>
          <Text fontSize="xs" color="neutral.400" textTransform="uppercase" letterSpacing="wider">
            {object.title}
          </Text>
          {priceContent}
        </Box>

        <Stack gap={2}>
          <Button 
            width="full" 
            onClick={() => handleAction('buy')} 
            loading={loading}
          >
            Comprar
          </Button>
          <Button 
            width="full" 
            variant="secondary" 
            onClick={() => handleAction('offer')} 
            loading={loading}
          >
            Hacer oferta
          </Button>
        </Stack>
      </Stack>
    </Card>
  )
}