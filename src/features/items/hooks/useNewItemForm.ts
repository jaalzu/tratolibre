"use client";

import { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemSchema } from "@/features/items/schemas";
import { ItemFormInput } from "@/features/items/schemas";
import { createItemAction, updateItemAction } from "@/features/items/actions";
import { Item } from "@/features/items/types";
import { useItemImages } from "./useItemImages";
import { z } from "zod";

export const useNewItemForm = (initialData?: Partial<Item>) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultValues = useMemo(
    () => ({
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      condition:
        (initialData?.condition as ItemFormInput["condition"]) ?? "good",
      province: initialData?.province ?? "",
      city: initialData?.city ?? "",
      images: initialData?.images ?? [],
      sale_price:
        initialData?.sale_price !== undefined
          ? String(initialData.sale_price)
          : "",
    }),
    [initialData],
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormInput>({
    resolver: zodResolver(ItemSchema),
    defaultValues,
    mode: "onTouched",
  });

  const { images, uploading, handleUpload, handleRemove } = useItemImages(
    initialData?.images ?? [],
  );

  const onSubmit: SubmitHandler<ItemFormInput> = async (data) => {
    setServerError(null);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value !== undefined && value !== null) {
        let valueToSend = String(value);
        if (key === "sale_price") {
          valueToSend = valueToSend.replace(/\D/g, "");
        }
        formData.append(key, valueToSend);
      }
    });

    if (initialData?.id) {
      formData.append("id", initialData.id);
      const result = await updateItemAction(null, formData);
      if (result?.error) {
        setServerError(
          typeof result.error === "string"
            ? result.error
            : "Error en el servidor",
        );
      }
    } else {
      const result = await createItemAction(null, formData);
      if (result?.error) {
        setServerError(
          typeof result.error === "string"
            ? result.error
            : "Error en el servidor",
        );
      }
    }
  };

  return {
    register,
    handleSubmit,
    watch,
    onSubmit,
    errors,
    isSubmitting,
    images,
    uploading,
    serverError,
    handleUpload: (files: File[]) =>
      handleUpload(files, (imgs) =>
        setValue("images", imgs, { shouldValidate: true }),
      ),
    handleRemove: (index: number) =>
      handleRemove(index, (imgs) =>
        setValue("images", imgs, { shouldValidate: true }),
      ),
    setValue,
    control,
  };
};
