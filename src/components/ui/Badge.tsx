import { Box } from '@chakra-ui/react'

const variants: Record<string, { bg: string; color: string }> = {
  pending:   { bg: '#fef9c3', color: '#854d0e' },
  accepted:  { bg: '#dcfce7', color: '#166534' },
  rejected:  { bg: '#fee2e2', color: '#991b1b' },
  active:    { bg: '#dbeafe', color: '#1e40af' },
  completed: { bg: '#f3f4f6', color: '#374151' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
}

const labels: Record<string, string> = {
  pending:   'Pendiente',
  accepted:  'Aceptada',
  rejected:  'Rechazada',
  active:    'En curso',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export function StatusBadge({ status }: { status: string }) {
  const s = variants[status] ?? { bg: 'neutral.100', color: 'neutral.700' }
  return (
    <Box
      as="span"
      bg={s.bg}
      color={s.color}
      fontSize="xs"
      fontWeight="bold"
      px={2}
      py={1}
      borderRadius="sm"
    >
      {labels[status] ?? status}
    </Box>
  )
}