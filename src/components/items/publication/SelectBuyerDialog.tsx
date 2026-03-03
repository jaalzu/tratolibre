'use client'

import { useEffect, useState } from 'react'
import { Dialog, Portal, Box, Flex, Text, Circle, Spinner } from '@chakra-ui/react'
import { Button } from '@/components/ui/Button'
import { getConversationsByItem } from '@/features/chat/actions/conversations'
import { markAsSoldToAction } from '@/features/items/actions'
import Image from 'next/image'

interface SelectBuyerDialogProps {
  open: boolean
  onClose: () => void
  itemId: string
}

export const SelectBuyerDialog = ({ open, onClose, itemId }: SelectBuyerDialogProps) => {
  const [buyers, setBuyers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [marking, setMarking] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    getConversationsByItem(itemId).then(data => {
      setBuyers(data)
      setLoading(false)
    })
  }, [open, itemId])

  const handleSelect = async (buyerId: string) => {
    setMarking(buyerId)
    await markAsSoldToAction(itemId, buyerId)
    setMarking(null)
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && !marking && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl" p={4} maxW="340px">
            <Dialog.Title fontSize="md" fontWeight="bold" mb={1}>
              ¿A quién le vendiste?
            </Dialog.Title>
            <Dialog.Description mb={4}>
              <Text fontSize="sm" color="neutral.500">
                Elegí la persona que compró este artículo.
              </Text>
            </Dialog.Description>

            {loading ? (
              <Flex justify="center" py={6}>
                <Spinner size="sm" color="brand.default" />
              </Flex>
            ) : buyers.length === 0 ? (
              <Text fontSize="sm" color="neutral.400" textAlign="center" py={6}>
                No hay conversaciones para este artículo
              </Text>
            ) : (
              <Flex direction="column" gap={2}>
                {buyers.map((conv: any) => {
                  const buyer = conv.buyer
                  const isMarking = marking === buyer?.id
                  return (
                    <Flex
                      key={conv.id}
                      align="center"
                      gap={3}
                      p={3}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="neutral.100"
                      cursor={marking ? 'not-allowed' : 'pointer'}
                      opacity={marking && !isMarking ? 0.5 : 1}
                      _hover={{ bg: 'neutral.50' }}
                      onClick={() => !marking && handleSelect(buyer?.id)}
                    >
                      {buyer?.avatar_url ? (
                        <Box position="relative" w="40px" h="40px" borderRadius="full" overflow="hidden" flexShrink={0}>
                          <Image src={buyer.avatar_url} alt={buyer.name} fill style={{ objectFit: 'cover' }} />
                        </Box>
                      ) : (
                        <Circle size="40px" bg="brand.default" color="white" fontWeight="bold" flexShrink={0}>
                          {buyer?.name?.[0]?.toUpperCase()}
                        </Circle>
                      )}
                      <Text fontSize="md" fontWeight="medium" color="neutral.900" flex="1">
                        {buyer?.name ?? 'Usuario'}
                      </Text>
                      {isMarking && <Spinner size="sm" color="brand.default" />}
                    </Flex>
                  )
                })}
              </Flex>
            )}

            {!marking && (
              <Button variant="ghost" size="sm" w="full" mt={4} onClick={onClose}>
                Cancelar
              </Button>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}