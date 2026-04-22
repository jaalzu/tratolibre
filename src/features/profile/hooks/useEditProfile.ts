"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateProfileAction } from "@/features/profile/actions/mutations";
import { EditProfileInput } from "@/features/profile/schemas";
import { EditProfileDefaultValues } from "@/features/profile/types";

export function useEditProfile(defaultValues: EditProfileDefaultValues) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    defaultValues.avatar_url ?? null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit: rhfSubmit,
    formState: { errors },
    control,
  } = useForm<EditProfileInput>({
    defaultValues: {
      name: defaultValues.name ?? "",
      location: defaultValues.location ?? "",
      province: defaultValues.province ?? "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSubmit = rhfSubmit((data) => {
    setSuccess(false);
    setServerError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", data.name ?? "");
        formData.append("location", data.location ?? "");
        formData.append("province", data.province ?? "");
        if (avatarFile) formData.append("avatar", avatarFile);

        const result = await updateProfileAction(formData);
        if (result?.error) {
          setServerError(result.error);
        } else {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      } catch (error) {
        setServerError("Error inesperado");
      }
    });
  });

  return {
    handleSubmit,
    isPending,
    success,
    serverError,
    register,
    errors,
    control,
    avatarUrl,
    handleAvatarChange,
  };
}
