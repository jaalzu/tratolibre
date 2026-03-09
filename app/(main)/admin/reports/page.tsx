// app/(main)/admin/reports/page.tsx
import { Box, Heading, Text } from '@chakra-ui/react'
import { ReportsList } from '@/features/admin/components/ReportsList'
import { getAdminReports } from '@/features/admin/actions'

export default async function AdminReportsPage() {
  const reports = await getAdminReports()

  return (
    <>
      <Box bg="neutral.50" borderRadius="3xl" px={{ base: 5, md: 10 }} py={{ base: 8, md: 10 }} mb={3}>
        <Text fontSize="xs" fontWeight="bold" color="brand.fg" textTransform="uppercase" letterSpacing="wider" mb={2}>
          Panel de administración
        </Text>
        <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="fg">
          Reportes
        </Heading>
      </Box>
      <Box bg="neutral.50" borderRadius="3xl" px={{ base: 5, md: 10 }} py={{ base: 8, md: 10 }}>
        <ReportsList reports={reports} />
      </Box>
    </>
  )
}