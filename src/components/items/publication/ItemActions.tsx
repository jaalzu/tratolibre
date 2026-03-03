'use client'

import { Text, Flex } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useStartChat } from '@/features/items/useStartChat'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { deleteItemAction, markAsSoldAction } from '@/features/items/actions'

export default function ItemActions({ item, userId }: { item: any, userId: string | null }) {
  const router = useRouter()
  const { startChat, loading } = useStartChat()
  const [open, setOpen] = useState(false)
  const [soldOpen, setSoldOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [marking, setMarking] = useState(false)

  const handleContact = () => {
    if (!userId) return router.push('/login')
    if (!item?.id || !item?.profiles?.id) return
    startChat(item.id, item.profiles.id)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteItemAction(item.id)
    setDeleting(false)
  }

  const handleMarkAsSold = async () => {
    setMarking(true)
    await markAsSoldAction(item.id)
    setMarking(false)
    setSoldOpen(false)
  }

  if (!userId) return (
    <Button asChild width="full" py={1}>
      <NextLink href="/login">Iniciá sesión para contactar</NextLink>
    </Button>
  )

  if (item.profiles?.id === userId) return (
    <>
      <Flex direction="column" gap={2}>
      {!item.sold && (
        <>
          <Text
            fontSize="sm"
            color="neutral.700"
            textAlign="center"
            cursor="pointer"
            textDecoration="underline"
            onClick={() => setSoldOpen(true)}
            _hover={{ color: 'neutral.900' }}
          >
            Marcar como vendido
          </Text>
          <Button asChild width="full" borderRadius="2xl" py={1} _hover={{ opacity: 0.85 }}>
            <NextLink href={`/item/${item.id}/edit`}>Editar publicación</NextLink>
          </Button>
          <Button
            width="full"
            borderRadius="2xl"
            py={1}
            bg="feedback.error"
            onClick={() => setOpen(true)}
            _hover={{ opacity: 0.85 }}
          >
            Eliminar
          </Button>
        </>
      )}
    </Flex>

      <ConfirmDialog
        open={soldOpen}
        onClose={() => setSoldOpen(false)}
        onConfirm={handleMarkAsSold}
        title="¿Marcar como vendido?"
        description="El artículo se marcará como vendido y dejará de aparecer en las búsquedas."
        confirmLabel="Confirmar venta"
        loading={marking}
        loadingLabel="Guardando..."
      />

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="¿Eliminár publicación?"
        description="Esta acción no se puede deshacer. La publicación será eliminada permanentemente."
        loading={deleting}
        loadingLabel="Eliminando..."
      />
    </>
  )

  if (item.sold) return (
    <Text fontSize="lg" color="feedback.error" fontWeight="bold" textAlign="center">
      Vendido
    </Text>
  )

  return (
    <Button
      width="full"
      borderRadius="2xl"
      bg="accent.default"
      py={1.5}
      onClick={handleContact}
      loading={loading}
    >
      Contactar vendedor
    </Button>
  )
}