"use client";

import { Dialog, Portal, Text, Flex, Spinner } from "@chakra-ui/react";
import { Button } from "@/shared/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  loadingLabel?: string;
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Eliminar",
  loading = false,
  loadingLabel = "Eliminando...",
}: ConfirmDialogProps) => (
  <Dialog.Root
    open={open}
    onOpenChange={(e) => !e.open && !loading && onClose()}
  >
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner mt={5}>
        <Dialog.Content borderRadius="lg" p={5} maxW="380px">
          {loading ? (
            <Flex align="center" gap={3} py={2}>
              <Spinner size="sm" color="brand.default" />
              <Text fontSize="sm" fontWeight="medium">
                {loadingLabel}
              </Text>
            </Flex>
          ) : (
            <>
              <Dialog.Title fontSize="lg" fontWeight="bold">
                {title}
              </Dialog.Title>
              <Dialog.Description mt={4}>
                <Text fontSize="md" color="fg.muted">
                  {description}
                </Text>
              </Dialog.Description>
              <Dialog.Footer mt={4} gap={2} pt={2}>
                <Button
                  variant="ghost"
                  size="sm"
                  p={2}
                  onClick={onClose}
                  data-testid="cancel-button"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  p={2}
                  data-testid="confirm-button"
                  onClick={() => {
                    onConfirm();
                  }}
                >
                  {confirmLabel}
                </Button>
              </Dialog.Footer>
            </>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
);
