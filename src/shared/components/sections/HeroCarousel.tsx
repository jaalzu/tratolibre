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

  if (!mounted) return null;

  return (
    <div
      className={styles.root}
      role="region"
      aria-roledescription="carousel"
      aria-label="Carrusel de tratolibre"
    >
      <div ref={scrollRef} className={styles.scrollContainer}>
        {slides.map((slide, i) => (
          <div key={i} className={styles.slide}>
            <HeroSlideContent slide={slide} priority={i === 0} />
          </div>
        ))}
      </div>

      <div className={styles.dotContainer}>
        {slides.map(
          (
            slide,
            i, // Cambiamos _ por slide para usar el título si quieres
          ) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Ir al slide ${i + 1}: ${slide.title || ""}`}
              aria-current={index === i ? "true" : "false"}
              className={`${styles.dot} ${
                index === i ? styles.dotActive : styles.dotInactive
              }`}
            />
          ),
        )}
      </div>
    </div>
  );
}
