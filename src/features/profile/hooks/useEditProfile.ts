"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { updateProfileAction } from "@/features/profile/actions/mutations";
import { EditProfileInput } from "@/features/profile/schemas";
import { EditProfileDefaultValues } from "@/features/profile/types";

// Unión discriminada
type FormStatus =
  | { state: "idle" }
  | { state: "success" }
  | { state: "error"; message: string };

export function useEditProfile(defaultValues: EditProfileDefaultValues) {
  const [isPending, startTransition] = useTransition();

  const [formStatus, setFormStatus] = useState<FormStatus>({ state: "idle" });

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
    setFormStatus({ state: "idle" });

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", data.name ?? "");
        formData.append("location", data.location ?? "");
        formData.append("province", data.province ?? "");
        if (avatarFile) formData.append("avatar", avatarFile);

        const result = await updateProfileAction(formData);

        if (result.status === "error") {
          setFormStatus({ state: "error", message: result.message });
        } else {
          setFormStatus({ state: "success" });
          setTimeout(() => setFormStatus({ state: "idle" }), 3000);
        }
      } catch (error) {
        setFormStatus({ state: "error", message: "Error inesperado" });
      }
    });
  });

  return {
    handleSubmit,
    isPending,
    success: formStatus.state === "success",
    serverError: formStatus.state === "error" ? formStatus.message : null,
    status: formStatus.state,
    register,
    errors,
    control,
    avatarUrl,
    handleAvatarChange,
  };
}
