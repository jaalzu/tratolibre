// features/admin/components/AdminMetrics.tsx
import { Box, SimpleGrid, Text } from '@chakra-ui/react'

interface Metric {
  label: string
  value: number
  sub?: string
}

interface AdminMetricsProps {
  metrics: {
    totalUsers: number
    newUsers: number
    totalItems: number
    newItems: number
    pendingReports: number
    totalConversations: number
  }
}

function MetricCard({ label, value, sub }: Metric) {
  return (
    <Box bg="neutral.50" borderRadius="2xl" px={6} py={5}>
      <Text fontSize="sm" color="fg.muted" mb={1}>{label}</Text>
      <Text fontSize="3xl" fontWeight="bold" color="fg">{value}</Text>
      {sub && <Text fontSize="xs" color="fg.muted" mt={1}>{sub}</Text>}
    </Box>
  )
}

export function AdminMetrics({ metrics }: AdminMetricsProps) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
      <MetricCard label="Usuarios totales" value={metrics.totalUsers} />
      <MetricCard label="Usuarios nuevos" value={metrics.newUsers} sub="Últimos 7 días" />
      <MetricCard label="Publicaciones activas" value={metrics.totalItems} />
      <MetricCard label="Publicaciones nuevas" value={metrics.newItems} sub="Últimos 7 días" />
      <MetricCard
        label="Reportes pendientes"
        value={metrics.pendingReports}
        sub={metrics.pendingReports > 0 ? 'Requieren revisión' : 'Todo al día'}
      />
      <MetricCard label="Conversaciones totales" value={metrics.totalConversations} />
    </SimpleGrid>
  )
}