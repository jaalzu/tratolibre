// features/admin/components/reports/ReportCard.tsx
import { Box, Separator, Text } from '@chakra-ui/react'
import { AdminReport } from '../../types'
import { REASON_LABEL } from '../../constants'
import { ReportCardBadges, TYPE_BG } from './ReportCardBadges'
import { ReportCardActions } from './ReportCardActions'

export function ReportCard({ report }: { report: AdminReport }) {
  return (
    <Box bg="neutral.50" borderRadius="2xl" overflow="hidden">
      <Box h={1} bg={TYPE_BG[report.type] ?? 'brand.subtle'} />

      <Box px={6} py={6}>
        <ReportCardBadges type={report.type} status={report.status} createdAt={report.created_at} />

        <Box mb={4}>
          <Text fontSize="md" fontWeight="bold" color="neutral.800" mb={1}>
            {REASON_LABEL[report.reason] ?? report.reason}
          </Text>
          {report.description && (
            <Text fontSize="sm" color="fg.muted" lineHeight="tall">
              {report.description}
            </Text>
          )}
        </Box>

        <Separator borderColor="neutral.150" mb={6} />
        <ReportCardActions report={report} />
      </Box>
    </Box>
  )
}