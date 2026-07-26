"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@boxicons/react";
import styles from "./ItemsCategorySection.module.css";

export function ScrollableRow({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [children]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className={styles.scrollWrapper}>
      <div className={styles.scrollArea} ref={scrollRef}>
        {children}
      </div>

      <div className={styles.arrows}>
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollByPage(-1)}
          disabled={!canLeft}
          className={styles.arrowButton}
        >
          <ChevronLeft width="18px" height="18px" />
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          onClick={() => scrollByPage(1)}
          disabled={!canRight}
          className={styles.arrowButton}
        >
          <ChevronRight width="18px" height="18px" />
        </button>
      </div>
    </div>
  );
}
