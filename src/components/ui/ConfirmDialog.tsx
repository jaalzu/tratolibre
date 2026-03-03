'use client'

import { Button, Dialog, Portal, Text, Flex, Spinner } from '@chakra-ui/react'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  loading?: boolean
  loadingLabel?: string
}

export const ConfirmDialog = ({ 
  open, onClose, onConfirm, title, description, 
  confirmLabel = 'Eliminar', loading = false, loadingLabel = 'Eliminando...'
}: ConfirmDialogProps) => (
  <Dialog.Root  open={open} onOpenChange={(e) => !e.open && !loading && onClose()}>
    <Portal >
      <Dialog.Backdrop />
      <Dialog.Positioner mt={5}>
        <Dialog.Content borderRadius="2xl" p={5} maxW="380px">
          {loading ? (
            <Flex align="center" gap={3} py={2}>
              <Spinner size="sm" color="brand.default" />
              <Text fontSize="sm" fontWeight="medium">{loadingLabel}</Text>
            </Flex>
          ) : (
            <>
              <Dialog.Title fontSize="lg" fontWeight="bold">{title}</Dialog.Title>
              <Dialog.Description mt={4}>
                <Text fontSize="md" color="neutral.600">{description}</Text>
              </Dialog.Description>
              <Dialog.Footer mt={4} gap={2} pt={2}>
                <Button variant="ghost" size="sm" p={2} onClick={onClose}>Cancelar</Button>
                <Button colorPalette="red" size="sm" p={2} onClick={() => { onConfirm() }}>{confirmLabel}</Button>
              </Dialog.Footer>
            </>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
)