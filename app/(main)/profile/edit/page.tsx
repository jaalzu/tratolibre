import { getMyProfile } from "@/features/profile/actions";
import { EditProfileForm } from "@/features/profile/components/edit/EditProfileForm";
import { Box, Flex, Text } from "@chakra-ui/react";
import { PageContainer } from "@/components/ui/PageContainer";
import NextLink from "next/link";
import { ArrowLeft } from "@boxicons/react";

export default async function EditProfilePage() {
  const { profile } = await getMyProfile();

  return (
    <PageContainer maxW="480px">
      <Flex align="center" gap={3} mb={6}>
        <NextLink href="/profile" passHref>
          <Box
            as="span"
            color="neutral.600"
            cursor="pointer"
            display="flex"
            alignItems="center"
          >
            <ArrowLeft width="28px" height="28px" fill="currentColor" />
          </Box>
        </NextLink>
        <Text fontWeight="bold" fontSize="lg">
          Editar perfil
        </Text>
      </Flex>

      <EditProfileForm
        defaultValues={{
          name: profile?.name ?? "",
          location: profile?.location ?? "",
        }}
      />
    </PageContainer>
  );
}
