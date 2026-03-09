// features/admin/components/ReportCard.tsx
'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { dismissReportAction, deleteReportedItemAction } from '@/features/admin/actions'
import { useRouter } from 'next/navigation'

const TYPE_LABEL: Record<string, string> = {
  item:         'Publicación',
  conversation: 'Conversación',
  user:         'Usuario',
}

const REASON_LABEL: Record<string, string> = {
  contenido_inapropiado: 'Contenido inapropiado',
  spam:                  'Spam o publicidad engañosa',
  producto_ilegal:       'Producto falsificado o ilegal',
  estafa:                'Estafa o fraude',
  acoso:                 'Acoso o comportamiento abusivo',
  otro:                  'Otro',
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'orange.500',
  reviewed:  'green.500',
  dismissed: 'fg.muted',
}

const STATUS_LABEL: Record<string, string> = {
  pending:   'Pendiente',
  reviewed:  'Revisado',
  dismissed: 'Desestimado',
}

interface ReportCardProps {
  report: {
    id: string
    type: string
    target_id: string
    reason: string
    description?: string
    status: string
    created_at: string
    reporter: { id: string, name: string } | null
  }
}

export function ReportCard({ report }: ReportCardProps) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmDismiss, setConfirmDismiss] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await deleteReportedItemAction(report.id, report.target_id)
    setLoading(false)
    setConfirmDelete(false)
    router.refresh()
  }

  async function handleDismiss() {
    setLoading(true)
    await dismissReportAction(report.id)
    setLoading(false)
    setConfirmDismiss(false)
    router.refresh()
  }

  return (
    <Box bg="neutral.50" borderRadius="2xl" px={6} py={5}>
      <Flex justify="space-between" align="flex-start" gap={4} flexWrap="wrap">

        {/* Info */}
        <Box flex={1}>
          <Flex gap={2} align="center" mb={2} flexWrap="wrap">
            <Box px={2} py={0.5} bg="brand.subtle" borderRadius="md">
              <Text fontSize="xs" fontWeight="bold" color="brand.fg">
                {TYPE_LABEL[report.type] ?? report.type}
              </Text>
            </Box>
            <Box px={2} py={0.5} bg="neutral.150" borderRadius="md">
              <Text fontSize="xs" color={STATUS_COLORS[report.status]} fontWeight="semibold">
                {STATUS_LABEL[report.status] ?? report.status}
              </Text>
            </Box>
          </Flex>

          <Text fontSize="sm" fontWeight="semibold" color="fg" mb={1}>
            {REASON_LABEL[report.reason] ?? report.reason}
          </Text>

          {report.description && (
            <Text fontSize="sm" color="fg.muted" mb={2}>
              {report.description}
            </Text>
          )}

          <Text fontSize="xs" color="fg.muted">
            Reportado por {report.reporter?.name ?? 'usuario desconocido'} —{' '}
            {new Date(report.created_at).toLocaleDateString('es-AR')}
          </Text>
        </Box>

        {/* Acciones */}
        {report.status === 'pending' && (
          <Flex gap={2} flexShrink={0} flexWrap="wrap">
            {report.type === 'item' && (
              <Button
                size="sm"
                colorPalette="red"
                
                onClick={() => setConfirmDelete(true)}
              >
                Eliminar publicación
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmDismiss(true)}
            >
              Desestimar
            </Button>
          </Flex>
        )}
      </Flex>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar publicación"
        description="Esto eliminará la publicación y todas sus imágenes. No se puede deshacer."
        confirmLabel="Eliminar"
        loading={loading}
        loadingLabel="Eliminando..."
      />

      <ConfirmDialog
        open={confirmDismiss}
        onClose={() => setConfirmDismiss(false)}
        onConfirm={handleDismiss}
        title="Desestimar reporte"
        description="El reporte se marcará como desestimado y no aparecerá más como pendiente."
        confirmLabel="Desestimar"
        loading={loading}
        loadingLabel="Desestimando..."
      />
    </Box>
  )
}