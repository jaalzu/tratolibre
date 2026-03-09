// app/(main)/admin/page.tsx
import { Box, Heading, Text } from '@chakra-ui/react'
import { AdminMetrics } from '@/features/admin/components/AdminMetrics'
import { getAdminMetrics } from '@/features/admin/actions'

export default async function AdminPage() {
  const metrics = await getAdminMetrics()

  return (
    <>
      <Box bg="neutral.50" borderRadius="3xl" px={{ base: 5, md: 10 }} py={{ base: 8, md: 10 }} mb={3}>
        <Text fontSize="xs" fontWeight="bold" color="brand.fg" textTransform="uppercase" letterSpacing="wider" mb={2}>
          Panel de administración
        </Text>
        <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="fg">
          Métricas generales
        </Heading>
      </Box>
      <Box bg="neutral.50" borderRadius="3xl" px={{ base: 5, md: 10 }} py={{ base: 8, md: 10 }}>
        <AdminMetrics metrics={metrics} />
      </Box>
    </>
  )
}