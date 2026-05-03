import { redirect } from "next/navigation";
import { getAuthUserWithRole } from "@/lib/supabase/utils/auth-helpers";
import { AdminNav } from "@/features/admin/components/ui/AdminNav";
import { Box } from "@chakra-ui/react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = await getAuthUserWithRole();
  if (!user || role !== "admin") redirect("/");

  return (
    <Box px={{ base: 4, md: 8 }} py={3}>
      <Box maxW="1200px" mx="auto">
        <Box
          bg="neutral.50"
          borderRadius="2xl"
          px={{ base: 5, md: 10 }}
          py={4}
          mb={3}
        >
          <AdminNav />
        </Box>
        {children}
      </Box>
    </Box>
  );
}
