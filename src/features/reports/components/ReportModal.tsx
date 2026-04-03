"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Stack,
  Textarea,
  Dialog,
  Portal,
  Spinner,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import { REPORT_REASONS } from "../schemas";
import { createReportAction } from "../actions";
import { CheckCircle } from "@boxicons/react";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  type: "item" | "conversation" | "user";
  targetId: string;
}

export function ReportModal({
  open,
  onClose,
  type,
  targetId,
}: ReportModalProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleClose() {
    if (loading) return;
    onClose();
    setReason(null);
    setDescription("");
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit() {
    if (!reason) return;
    setLoading(true);
    setError(null);

    const result = await createReportAction({
      type,
      target_id: targetId,
      reason,
      description,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => handleClose(), 2000);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner mt={5}>
          <Dialog.Content borderRadius="2xl" p={5} maxW="420px">
            {loading ? (
              <Flex align="center" gap={3} py={2}>
                <Spinner size="sm" color="brand.default" />
                <Text fontSize="sm" fontWeight="medium">
                  Enviando reporte...
                </Text>
              </Flex>
            ) : success ? (
              <Flex direction="column" align="center" gap={3} py={4}>
                <CheckCircle
                  width="36px"
                  height="36px"
                  fill="var(--chakra-colors-brand-default)"
                />
                <Text fontWeight="semibold" color="fg">
                  Reporte enviado
                </Text>
                <Text fontSize="sm" color="fg.muted" textAlign="center">
                  Gracias por ayudarnos a mantener la comunidad. Lo revisaremos
                  pronto.
                </Text>
              </Flex>
            ) : (
              <>
                <Dialog.Title fontSize="lg" fontWeight="bold">
                  Reportar contenido
                </Dialog.Title>

                <Dialog.Description mt={4}>
                  <Stack gap={2}>
                    {REPORT_REASONS.map((r) => (
                      <Flex
                        key={r.value}
                        align="center"
                        gap={3}
                        p={3}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={
                          reason === r.value ? "brand.default" : "border.subtle"
                        }
                        bg={reason === r.value ? "brand.subtle" : "transparent"}
                        cursor="pointer"
                        onClick={() => setReason(r.value)}
                        transition="all 0.15s"
                      >
                        <Box
                          w={4}
                          h={4}
                          borderRadius="full"
                          border="2px solid"
                          borderColor={
                            reason === r.value ? "brand.default" : "border"
                          }
                          bg={
                            reason === r.value ? "brand.default" : "transparent"
                          }
                          flexShrink={0}
                        />
                        <Text fontSize="sm" color="fg">
                          {r.label}
                        </Text>
                      </Flex>
                    ))}

                    {reason === "otro" && (
                      <Textarea
                        placeholder="Contanos más detalles (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fontSize="sm"
                        borderRadius="xl"
                        resize="none"
                        rows={3}
                        mt={1}
                      />
                    )}

                    {error && (
                      <Text fontSize="sm" color="red.500">
                        {error}
                      </Text>
                    )}
                  </Stack>
                </Dialog.Description>

                <Dialog.Footer mt={4} gap={2} pt={2}>
                  <Button variant="ghost" size="sm" p={2} onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    p={2}
                    disabled={!reason}
                    onClick={handleSubmit}
                  >
                    Enviar reporte
                  </Button>
                </Dialog.Footer>
              </>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
