// features/reports/components/ReportModalContent.tsx

import { Dialog, Stack, Text, Textarea } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import { REPORT_REASONS } from "../constants";
import { ReportReason } from "../types";
import { ReportReasonOption } from "./ReportReasonOption";

interface ReportModalContentProps {
  reason: ReportReason | null;
  setReason: (reason: ReportReason) => void;
  description: string;
  setDescription: (description: string) => void;
  error: string | null;
  onSubmit: () => void;
  onClose: () => void;
}

export function ReportModalContent({
  reason,
  setReason,
  description,
  setDescription,
  error,
  onSubmit,
  onClose,
}: ReportModalContentProps) {
  return (
    <>
      <Dialog.Title fontSize="lg" fontWeight="bold">
        Reportar contenido
      </Dialog.Title>

      <Dialog.Description mt={4}>
        <Stack gap={2}>
          {REPORT_REASONS.map((r) => (
            <ReportReasonOption
              key={r.value}
              option={r}
              selected={reason === r.value}
              onSelect={() => setReason(r.value)}
            />
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
        <Button variant="ghost" size="sm" p={2} onClick={onClose}>
          Cancelar
        </Button>
        <Button size="sm" p={2} disabled={!reason} onClick={onSubmit}>
          Enviar reporte
        </Button>
      </Dialog.Footer>
    </>
  );
}
