// app/(main)/admin/layout.tsx
import { redirect } from 'next/navigation'
import { getAuthUserWithRole } from '@/lib/supabase/getAuthUserWithRole'
import { AdminNav } from '@/features/admin/components/AdminNav'
import { Box } from '@chakra-ui/react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = await getAuthUserWithRole()
  if (!user || role !== 'admin') redirect('/')

  return (
    <Box minH="100vh" bg="neutral.150" px={{ base: 4, md: 8 }} py={6}>
      <Box maxW="1200px" mx="auto">
        <Box bg="neutral.50" borderRadius="3xl" px={{ base: 5, md: 10 }} py={4} mb={3}>
          <AdminNav />
        </Box>
        {children}
      </Box>
    </Box>
  )
}