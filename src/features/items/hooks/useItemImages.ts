"use client";

import { useState, useCallback } from "react";
import { useImageUpload } from "./useImageUpload";

export function useItemImages(initialImages: string[] = []) {
  const [images, setImages] = useState<string[]>(initialImages);
  const { uploadImages, uploading } = useImageUpload();

  const handleUpload = useCallback(
    async (files: File[], onUpdate: (imgs: string[]) => void) => {
      const urls = await uploadImages(files);

      if (urls.length > 0) {
        setImages((prev) => {
          const updated = [...prev, ...urls];
          onUpdate(updated);
          return updated;
        });
      }
    },
    [uploadImages],
  );

  const handleRemove = useCallback(
    (index: number, onUpdate: (imgs: string[]) => void) => {
      setImages((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        onUpdate(updated);
        return updated;
      });
    },
    [],
  );

  return { images, uploading, handleUpload, handleRemove };
}
