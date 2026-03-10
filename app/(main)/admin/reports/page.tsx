// app/(main)/admin/reports/page.tsx
import { ReportsView } from '@/features/admin/components/reports/ReportsView'
import { getAdminReports } from '@/features/admin/actions'

export default async function AdminReportsPage() {
  const reports = await getAdminReports()

  return (
    <>
      <ReportsView reports={reports} />
    </>
  )
}