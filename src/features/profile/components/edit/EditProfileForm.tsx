"use client";

import { Box, Text, Flex, Avatar } from "@chakra-ui/react";
import { Button } from "@/components/ui/Button";
import { EditProfileFields } from "./EditProfileFields";
import { useEditProfile } from "@/features/profile/useEditProfile";
import { Camera } from "@boxicons/react";

interface EditProfileFormProps {
  defaultValues: {
    name?: string | null;
    location?: string | null;
    province?: string | null;
    avatar?: string | null;
  };
}

export const EditProfileForm = ({ defaultValues }: EditProfileFormProps) => {
  const {
    handleSubmit,
    isPending,
    success,
    serverError,
    register,
    errors,
    control,
    avatarUrl,
    handleAvatarChange,
  } = useEditProfile(defaultValues);

  return (
    <form onSubmit={handleSubmit}>
      {/* Avatar */}
      <Flex justify="center" mb={6}>
        <Box position="relative">
          <Avatar.Root size="2xl">
            <Avatar.Image src={avatarUrl ?? undefined} />
            <Avatar.Fallback>{defaultValues.name?.[0] ?? "?"}</Avatar.Fallback>
          </Avatar.Root>
          <label
            htmlFor="avatar-upload"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "var(--chakra-colors-brand-default)",
              color: "white",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "var(--chakra-shadows-sm)",
            }}
          >
            <Camera width="14px" height="14px" fill="currentColor" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </label>
        </Box>
      </Flex>

      <EditProfileFields
        register={register}
        errors={errors}
        control={control}
      />

      {success && (
        <Text
          fontSize="xs"
          color="green.500"
          mt={3}
          textAlign="center"
          fontWeight="medium"
        >
          ¡Perfil actualizado correctamente!
        </Text>
      )}

      {serverError && (
        <Text
          fontSize="xs"
          color="red.500"
          mt={3}
          textAlign="center"
          fontWeight="medium"
        >
          {serverError}
        </Text>
      )}

      <Button
        type="submit"
        w="full"
        borderRadius="full"
        mt={6}
        py={2}
        px={1}
        loading={isPending}
      >
        Guardar cambios
      </Button>
    </form>
  );
};
