"use client";

import { useEffect, useRef, useState } from "react";
import { HeroSlideContent } from "./Hero";
import styles from "./HeroCarousel.module.css";

export function HeroCarousel({ slides }: { slides: any[] }) {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (index + 1) % slides.length;
      scrollTo(next);
    }, 4000);
    return () => clearInterval(interval);
  }, [index, slides.length]);

  const scrollTo = (i: number) => {
    setIndex(i);
    scrollRef.current?.scrollTo({
      left: scrollRef.current.offsetWidth * i,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.root}>
      {/* El motor es puro CSS: scroll-snap */}
      <div ref={scrollRef} className={styles.scrollContainer}>
        {slides.map((slide, i) => (
          <div key={i} className={styles.slide}>
            <HeroSlideContent slide={slide} priority={i === 0} />
          </div>
        ))}
      </div>

      {/* Puntitos manuales */}
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
