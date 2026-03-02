// edit/page.tsx
import { getMyProfile } from '@/features/profile/actions'
import { EditProfileForm } from '@/components/profile/edit/EditProfileForm'
import { PageContainer } from '@/components/ui/PageContainer'
import { Box, Flex, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import 'boxicons/css/boxicons.min.css'

export default async function EditProfilePage() {
  const { profile } = await getMyProfile()

  return (
    <PageContainer maxW="480px">
      <Flex align="center" gap={3} mb={6}>
        <NextLink href="/profile">
          <Box color="neutral.600" cursor="pointer">
            <i className="bx bx-arrow-back" style={{ fontSize: '22px' }} />
          </Box>
        </NextLink>
        <Text fontWeight="bold" fontSize="lg">Editar perfil</Text>
      </Flex>

      <EditProfileForm defaultValues={{ name: profile?.name, location: profile?.location }} />
    </PageContainer>
  )
}