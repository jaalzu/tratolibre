// features/items/hooks/useNewItemForm.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemSchema, ItemInput } from "@/features/items/schemas";
import { createItemAction, updateItemAction } from "@/features/items/actions";
import { Item } from "@/features/items/types";
import { compressImages } from "@/lib/compress";
import { toaster } from "@/components/ui/toaster";

export const useNewItemForm = (initialData?: Partial<Item>) => {
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultValues = useMemo(
    () => ({
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      condition: (initialData?.condition as ItemInput["condition"]) ?? "good",
      province: initialData?.province ?? "",
      city: initialData?.city ?? "",
      images: initialData?.images ?? [],
      sale_price: initialData?.sale_price ?? undefined,
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
  } = useForm<ItemInput>({
    resolver: zodResolver(ItemSchema),
    defaultValues,
    mode: "onTouched", // ✅ Reduce validaciones
  });

  const handleUpload = useCallback(
    async (files: File[]) => {
      setUploading(true);

      const validFiles = files.filter((f) => {
        if (!f.type.startsWith("image/")) {
          toaster.create({
            title: "Archivo no válido",
            description: `${f.name} no es una imagen`,
            type: "error",
          });
          return false;
        }

        if (f.size > 20 * 1024 * 1024) {
          toaster.create({
            title: "Imagen muy pesada",
            description: `${f.name} pesa más de 20MB`,
            type: "error",
          });
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) {
        setUploading(false);
        return;
      }

      try {
        const compressedFiles = await compressImages(validFiles);
        const urls: string[] = [];

        // ✅ Upload secuencial pero con mejor manejo de errores
        for (const file of compressedFiles) {
          try {
            const fd = new FormData();
            fd.append("file", file);

            const res = await fetch("/api/upload", {
              method: "POST",
              body: fd,
              signal: AbortSignal.timeout(30000),
            });

            if (!res.ok) {
              console.error(`Upload failed: ${res.status}`);
              continue;
            }

            const data = await res.json();
            if (data.fileName || data.url) {
              urls.push(data.url || `/${data.fileName}`);
            }
          } catch (err) {
            console.error("Error uploading:", err);
          }
        }

        if (urls.length > 0) {
          setImages((prev) => {
            const updated = [...prev, ...urls];
            setValue("images", updated, { shouldValidate: true });
            return updated;
          });
        }

        const failedCount = compressedFiles.length - urls.length;
        if (failedCount > 0) {
          toaster.create({
            title: "Algunas imágenes fallaron",
            description: `${failedCount} imagen(es) no se pudieron subir`,
            type: "warning",
          });
        }
      } catch (err) {
        toaster.create({
          title: "Error al procesar",
          description: "Hubo un problema al procesar las imágenes",
          type: "error",
        });
      } finally {
        setUploading(false);
      }
    },
    [setValue],
  );

  const handleRemove = useCallback(
    (index: number) => {
      setImages((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        setValue("images", updated, { shouldValidate: true });
        return updated;
      });
    },
    [setValue],
  );

  const onSubmit: SubmitHandler<ItemInput> = async (data) => {
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
    handleUpload,
    handleRemove,
    setValue,
    control,
  };
};
