import { useState } from "react";

export function useImageSlider(images: string[]) {
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const goNext = () => setActive((prev) => (prev + 1) % images.length);
  const goPrev = () =>
    setActive((prev) => (prev - 1 + images.length) % images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  return {
    active,
    goNext,
    goPrev,
    handleTouchStart,
    handleTouchEnd,
  };
}
