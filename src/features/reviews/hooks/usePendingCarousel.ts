import { useState } from "react";
import type { PendingReview } from "../types";

export function usePendingCarousel(pendingReviews: PendingReview[]) {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const total = pendingReviews.length;
  const currentReview = pendingReviews[current];

  // Navegación
  const next = () => {
    if (current < total - 1) {
      setCurrent((c) => c + 1);
    } else {
      setDismissed(true);
    }
  };

  const prev = () => {
    setCurrent((c) => Math.max(0, c - 1));
  };

  const openReview = () => setIsModalOpen(true);

  const closeReview = () => {
    setIsModalOpen(false);
    // Al cerrar (después de calificar o cancelar), pasamos a la siguiente
    next();
  };

  const isVisible = total > 0 && !dismissed && !!currentReview;

  return {
    current,
    total,
    currentReview,
    isVisible,
    isModalOpen,
    next,
    prev,
    openReview,
    closeReview,
  };
}
