"use client";

import { useState, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemSchema, ItemFormInput } from "@/features/items/schemas";
import { createItemAction, updateItemAction } from "@/features/items/actions";
import { Item } from "@/features/items/types";
import { useItemImages } from "./useItemImages";

// ============================================
// TYPES - Estados del formulario
// ============================================

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; itemId: string }
  | { status: "error"; message: string };

// ============================================
// HOOK
// ============================================

export const useNewItemForm = (initialData?: Partial<Item>) => {
  const [formState, setFormState] = useState<FormState>({ status: "idle" });

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

  // ============================================
  // SUBMIT HANDLER
  // ============================================

  const onSubmit: SubmitHandler<ItemFormInput> = async (data) => {
    setFormState({ status: "submitting" });

    const formData = new FormData();

    // Agregar todos los campos al FormData
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

    try {
      let result;

      // Modo edición
      if (initialData?.id) {
        formData.append("id", initialData.id);
        result = await updateItemAction(null, formData);
      }
      // Modo creación
      else {
        result = await createItemAction(null, formData);
      }

      // Manejar resultado con type narrowing
      if (!result.success) {
        setFormState({
          status: "error",
          message:
            typeof result.error === "string"
              ? result.error
              : "Error de validación. Revisá los campos",
        });
        return;
      }

      // Success en creación
      if ("data" in result && result.data && "itemId" in result.data) {
        setFormState({
          status: "success",
          itemId: result.data.itemId,
        });
      }
      // Success en actualización
      else {
        setFormState({
          status: "success",
          itemId: initialData?.id ?? "",
        });
      }
    } catch (error) {
      console.error("Error inesperado en submit:", error);
      setFormState({
        status: "error",
        message: "Ocurrió un error inesperado",
      });
    }
  };

  // ============================================
  // HELPERS
  // ============================================

  const resetFormState = () => {
    setFormState({ status: "idle" });
  };

  // ============================================
  // RETURN
  // ============================================

  return {
    // Form control
    register,
    handleSubmit,
    watch,
    setValue,
    control,

    // Form state
    errors,
    isSubmitting,
    formState,
    resetFormState,

    // Images
    images,
    uploading,
    handleUpload: (files: File[]) =>
      handleUpload(files, (imgs) =>
        setValue("images", imgs, { shouldValidate: true }),
      ),
    handleRemove: (index: number) =>
      handleRemove(index, (imgs) =>
        setValue("images", imgs, { shouldValidate: true }),
      ),

    // Submit
    onSubmit,
  };
};
