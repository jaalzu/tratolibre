// EditProfilePage.tsx (Server Component)
import { getMyProfile } from "@/features/profile/actions";
import { Box, Flex, Text } from "@chakra-ui/react";
import { PageContainer } from "@/components/ui/PageContainer";
import NextLink from "next/link";
import { ArrowLeft } from "@boxicons/react";
import dynamic from "next/dynamic";

const EditProfileForm = dynamic(
  () =>
    import("@/features/profile/components/edit/EditProfileForm").then(
      (mod) => mod.EditProfileForm,
    ),
  {
    ssr: true,
    loading: () => <Box h="300px" bg="neutral.50" borderRadius="md" />, // Un placeholder simple
  },
);

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
