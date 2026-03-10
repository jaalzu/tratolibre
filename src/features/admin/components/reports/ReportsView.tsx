// features/admin/components/ReportsView.tsx
'use client'

import { Box, Text } from '@chakra-ui/react'
import { AdminReport } from '../../types'
import { ReportFilters } from './ReportFilters'
import { ReportsList } from './ReportsList'
import { useReportFilters } from '../../hooks/useReportFilters'

export function ReportsView({ reports }: { reports: AdminReport[] }) {
  const { type, setType, status, setStatus, filtered } = useReportFilters(reports)

  return (
    <>
      {/* Filtros */}
      <Box bg="neutral.50" borderRadius="3xl" px={{ base: 5, md: 10 }} py={6} mb={3}>
        <ReportFilters
          type={type}
          status={status}
          setType={setType}
          setStatus={setStatus}
          reports={reports}
        />
      </Box>

      {/* Contador */}
      <Text fontSize="xs" color="fg.muted" mb={3} px={1}>
        {filtered.length} {filtered.length === 1 ? 'reporte' : 'reportes'}
      </Text>

      {/* Lista — cada card suelta sobre el fondo */}
      <ReportsList reports={filtered} />
    </>
  )
}