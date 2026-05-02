"use client";

import { useEffect, useRef, useState } from "react";
import { HeroSlideContent } from "./HeroSlideContent";
import styles from "./HeroCarousel.module.css";

export function HeroCarousel({ slides }: { slides: any[] }) {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // 🔥 ocultar hero SSR
    const staticHero = document.getElementById("hero-static");
    if (staticHero) {
      staticHero.style.display = "none";
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      const next = (index + 1) % slides.length;
      scrollTo(next);
    }, 4000);

    return () => clearInterval(interval);
  }, [index, slides.length, mounted]);

  const scrollTo = (i: number) => {
    setIndex(i);
    scrollRef.current?.scrollTo({
      left: scrollRef.current.offsetWidth * i,
      behavior: "smooth",
    });
  };

  // 🔥 IMPORTANTE: ocultamos hasta que monte
  if (!mounted) return null;

  return (
    <div className={styles.root}>
      <div ref={scrollRef} className={styles.scrollContainer}>
        {slides.map((slide, i) => (
          <div key={i} className={styles.slide}>
            <HeroSlideContent slide={slide} priority={i === 0} />
          </div>
        ))}
      </div>

      <div className={styles.dotContainer}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`${styles.dot} ${
              index === i ? styles.dotActive : styles.dotInactive
            }`}
          />
        ))}
      </div>
    </div>
  );
}
