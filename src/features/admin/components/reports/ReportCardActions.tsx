"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import NextLink from "next/link";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TARGET_HREF } from "../../constants";
import { useReportActions } from "../../hooks/useReportActions";
import { AdminReport } from "../../types";

interface ReportCardActionsProps {
  report: AdminReport;
}

export function ReportCardActions({ report }: ReportCardActionsProps) {
  const { loading, deleteItem, dismissReport, markAsReviewed } =
    useReportActions();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDismiss, setConfirmDismiss] = useState(false);
  const [confirmReviewed, setConfirmReviewed] = useState(false);

  const targetHref = TARGET_HREF[report.type]?.(report.target_id);

  return (
    <>
      {/* Reporter */}
      <Flex align="center" gap={2} mb={4}>
        <Box
          w={6}
          h={6}
          borderRadius="full"
          bg="brand.subtle"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="xs" fontWeight="bold" color="brand.fg">
            {report.reporter?.name?.[0]?.toUpperCase() ?? "?"}
          </Text>
        </Box>
        <Text fontSize="xs" color="fg.muted">
          Reportado por{" "}
          <Text as="span" fontWeight="semibold" color="fg">
            {report.reporter?.name ?? "usuario desconocido"}
          </Text>
        </Text>
      </Flex>

      {/* Botones */}
      <Flex gap={2} align="center" flexWrap="wrap" justify="flex-end">
        <Button
          size="sm"
          variant="secondary"
          py={1.5}
          px={3}
          asChild
          _hover={{ bg: "neutral.100" }}
        >
          <NextLink
            href={targetHref}
            target={report.type !== "conversation" ? "_blank" : undefined}
          >
            <Flex align="center" gap={1.5}>
              <i className="bx bx-link-external" style={{ fontSize: "13px" }} />
              Ver contenido
            </Flex>
          </NextLink>
        </Button>

        {report.status === "pending" && (
          <>
            {report.type === "item" && (
              <Button
                size="sm"
                py={1.5}
                px={3}
                bg="neutral.50"
                color="brand.dark"
                border="1px solid"
                borderColor="brand.dark"
                _hover={{ bg: "brand.100" }}
                onClick={() => setConfirmDelete(true)}
              >
                Eliminar
              </Button>
            )}
            {(report.type === "user" || report.type === "conversation") && (
              <Button
                size="sm"
                py={1.5}
                px={3}
                bg="neutral.50"
                color="brand.dark"
                border="1px solid"
                borderColor="brand.dark"
                _hover={{ bg: "brand.100" }}
                onClick={() => setConfirmReviewed(true)}
              >
                Marcar revisado
              </Button>
            )}
            <Button
              size="sm"
              py={1.5}
              px={3}
              bg="neutral.50"
              color="red.600"
              border="1px solid"
              borderColor="red.600"
              _hover={{ bg: "red.50" }}
              onClick={() => setConfirmDismiss(true)}
            >
              Desestimar
            </Button>
          </>
        )}
      </Flex>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => deleteItem(report.id, report.target_id)}
        title="Eliminar publicación"
        description="Esto eliminará la publicación y todas sus imágenes. No se puede deshacer."
        confirmLabel="Eliminar"
        loading={loading}
        loadingLabel="Eliminando..."
      />
      <ConfirmDialog
        open={confirmDismiss}
        onClose={() => setConfirmDismiss(false)}
        onConfirm={() => dismissReport(report.id)}
        title="Desestimar reporte"
        description="El reporte se marcará como desestimado y no aparecerá más como pendiente."
        confirmLabel="Desestimar"
        loading={loading}
        loadingLabel="Desestimando..."
      />
      <ConfirmDialog
        open={confirmReviewed}
        onClose={() => setConfirmReviewed(false)}
        onConfirm={() => markAsReviewed(report.id)}
        title="Marcar como revisado"
        description="Confirmás que revisaste el contenido y tomaste las acciones necesarias."
        confirmLabel="Confirmar"
        loading={loading}
        loadingLabel="Guardando..."
      />
    </>
  );
}
