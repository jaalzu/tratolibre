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
  <Dialog.Root open={open} onOpenChange={(e) => !e.open && !loading && onClose()}>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content borderRadius="2xl" p={4} maxW="320px">
          {loading ? (
            <Flex align="center" gap={3} py={2}>
              <Spinner size="sm" color="brand.default" />
              <Text fontSize="sm" fontWeight="medium">{loadingLabel}</Text>
            </Flex>
          ) : (
            <>
              <Dialog.Title fontSize="md" fontWeight="bold">{title}</Dialog.Title>
              <Dialog.Description mt={1}>
                <Text fontSize="sm" color="neutral.600">{description}</Text>
              </Dialog.Description>
              <Dialog.Footer mt={4} gap={2} p={0}>
                <Button variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
                <Button colorPalette="red" size="sm" onClick={() => { onConfirm() }}>{confirmLabel}</Button>
              </Dialog.Footer>
            </>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
)