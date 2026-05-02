"use client";

import { useState, useCallback } from "react";
import { compressImages } from "@/lib/compress";
import { toaster } from "@/components/ui/toaster";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
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
      return [];
    }

    try {
      const compressedFiles = await compressImages(validFiles);
      const urls: string[] = [];

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
            const errorData = await res.text();
            console.error("❌ Upload failed:", res.status, errorData);
            toaster.create({
              title: "Error al subir imagen",
              description: `Error ${res.status}: ${errorData}`,
              type: "error",
            });
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

      const failedCount = compressedFiles.length - urls.length;
      if (failedCount > 0) {
        toaster.create({
          title: "Algunas imágenes fallaron",
          description: `${failedCount} imagen(es) no se pudieron subir`,
          type: "warning",
        });
      }

      return urls;
    } catch (err) {
      toaster.create({
        title: "Error al procesar",
        description: "Hubo un problema al procesar las imágenes",
        type: "error",
      });
      return [];
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploadImages, uploading };
}
