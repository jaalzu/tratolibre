import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { submitReviewAction } from "../actions/mutations/submitReview";
import type { ReviewInput } from "../schemas";

export function useReviewForm(onSuccess?: () => void) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setRating(0);
    setComment("");
    setError(null);
  };

  const handleSubmit = async (
    baseData: Omit<ReviewInput, "rating" | "comment">,
  ) => {
    if (rating === 0) {
      setError("Por favor, selecciona una puntuación");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await submitReviewAction({
        ...baseData,
        rating,
        comment,
      });

      if (result.error) {
        setError(result.error);

        // En v3 usamos toaster.create
        toaster.create({
          title: "Error",
          description: result.error,
          type: "error", // En v3 es 'type', no 'status'
        });
      } else {
        toaster.create({
          title: "¡Gracias!",
          description: "Tu reseña ha sido enviada",
          type: "success",
        });

        reset();
        onSuccess?.();
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
      toaster.create({
        title: "Error",
        description: "No se pudo enviar la reseña",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rating,
    setRating,
    comment,
    setComment,
    isLoading,
    error,
    handleSubmit,
    reset,
  };
}
