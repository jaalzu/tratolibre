// app/(main)/admin/page.tsx
import { Box, Heading, Text } from '@chakra-ui/react'
import { AdminMetrics } from '@/features/admin/components/metrics/AdminMetrics'
import { getAdminMetrics } from '@/features/admin/actions'

export default async function AdminPage() {
  const metrics = await getAdminMetrics()

  return (
    <>
      <AdminMetrics metrics={metrics} />
    </>
  )
}