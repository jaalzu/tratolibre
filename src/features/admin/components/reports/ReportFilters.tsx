// features/admin/components/reports/ReportFilters.tsx
'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import { TYPE_FILTERS, STATUS_FILTERS } from '../../constants'
import { AdminReport } from '../../types'
import { TabGroup } from './TabGroup'

interface ReportFiltersProps {
  type: string
  status: string
  setType: (v: string) => void
  setStatus: (v: string) => void
  reports: AdminReport[]
}

export function ReportFilters({ type, status, setType, setStatus, reports }: ReportFiltersProps) {
  return (
    <Flex direction="column" gap={4}>
      <Box>
        <Text fontSize="xs" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" mb={2}>
          Estado
        </Text>
        <TabGroup options={STATUS_FILTERS} value={status} onChange={setStatus} reports={reports} filterKey="status" />
      </Box>
      <Box>
        <Text fontSize="xs" fontWeight="bold" color="fg.muted" textTransform="uppercase" letterSpacing="wider" mb={2}>
          Tipo
        </Text>
        <TabGroup options={TYPE_FILTERS} value={type} onChange={setType} reports={reports} />
      </Box>
    </Flex>
  )
}