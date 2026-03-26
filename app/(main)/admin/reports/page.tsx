// app/(main)/admin/reports/page.tsx
import dynamic from "next/dynamic";
import { getAdminReports } from "@/features/admin/actions";
import { Spinner, Center } from "@chakra-ui/react";

const ReportsView = dynamic(
  () =>
    import("@/features/admin/components/reports/ReportsView").then(
      (mod) => mod.ReportsView,
    ),
  {
    loading: () => (
      <Center py={20}>
        <Spinner size="xl" color="brand.500" />
      </Center>
    ),
  },
);

export default async function AdminReportsPage() {
  const reports = await getAdminReports();
  return <ReportsView reports={reports} />;
}
