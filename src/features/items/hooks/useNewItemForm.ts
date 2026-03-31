"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ItemInput>({
    resolver: zodResolver(ItemSchema) as Resolver<ItemInput>,
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      condition: (initialData?.condition as ItemInput["condition"]) ?? "good",
      province: initialData?.province ?? "",
      city: initialData?.city ?? "",
      images: initialData?.images ?? [],
      sale_price: initialData?.sale_price ?? undefined,
    },
  });

  const handleUpload = async (files: File[]) => {
    setUploading(true);

    // ✅ VALIDACIÓN PREVIA - EMPIEZA AQUÍ
    const validFiles = files.filter((f) => {
      // Verificar que sea imagen
      if (!f.type.startsWith("image/")) {
        console.warn(`❌ No es imagen: ${f.name} (${f.type})`);
        toaster.create({
          title: "Archivo no válido",
          description: `${f.name} no es una imagen`,
          type: "error",
        });
        return false;
      }

      // Verificar tamaño (20MB máximo antes de comprimir)
      if (f.size > 20 * 1024 * 1024) {
        console.warn(
          `❌ Muy pesado: ${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`,
        );
        toaster.create({
          title: "Imagen muy pesada",
          description: `${f.name} pesa más de 20MB. Usá una foto de menor calidad.`,
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
    // ✅ VALIDACIÓN PREVIA - TERMINA AQUÍ

    try {
      const compressedFiles = await compressImages(validFiles); // ✅ Cambiado de 'files' a 'validFiles'

      for (const file of compressedFiles) {
        const fd = new FormData();
        fd.append("file", file);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: fd,
            signal: AbortSignal.timeout(30000), // ✅ Timeout de 30 segundos
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ Error en upload:", res.status, errorText);

            toaster.create({
              title: "Error al subir",
              description: `No se pudo subir ${file.name}`,
              type: "error",
            });
            continue;
          }

          const data = await res.json();

          if (data.fileName || data.url) {
            const urlToSave = data.url || `/${data.fileName}`;
            setImages((prev) => {
              const updated = [...prev, urlToSave];
              setValue("images", updated, { shouldValidate: true });
              return updated;
            });
          }
        } catch (err) {
          console.error("Error subiendo imagen:", err);

          toaster.create({
            title: "Error de conexión",
            description: `No se pudo subir ${file.name}. Revisá tu conexión.`,
            type: "error",
          });
        }
      }
    } catch (err) {
      console.error("Error en el proceso de imágenes:", err);
      toaster.create({
        title: "Error al procesar",
        description: "Hubo un problema al procesar las imágenes",
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setValue("images", updated, { shouldValidate: true });
      return updated;
    });
  };

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
