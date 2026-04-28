"use client";

import NextLink from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { useState, useEffect, useRef } from "react";
import { PageContainer } from "@/components/ui/PageContainer";
import { ChevronUp, ChevronDown } from "@boxicons/react";
import styles from "./CategoriesGrid.module.css";

const INITIAL_COUNT = 6;

export function CategoriesGrid() {
  const [expanded, setExpanded] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const visible = expanded ? CATEGORIES : CATEGORIES.slice(0, INITIAL_COUNT);

  return (
    <PageContainer>
      <div
        ref={containerRef}
        className={styles.card}
        style={{ minHeight: !isNear ? "150px" : "auto" }}
      >
        {!isNear ? null : (
          <>
            <h3 className={styles.title}>Categorías</h3>

            <div className={styles.divider} />

            <div className={styles.grid}>
              {visible.map((cat) => {
                const Icon = cat.icon;

                return (
                  <NextLink
                    key={cat.id}
                    href={`/category/${cat.id}`}
                    className={styles.categoryItem}
                  >
                    <Icon
                      width="24px"
                      height="24px"
                      fill="var(--chakra-colors-brand-default)"
                    />
                    <span className={styles.categoryLabel}>{cat.label}</span>
                  </NextLink>
                );
              })}
            </div>

            <div className={styles.footerDivider} />

            <button
              onClick={() => setExpanded(!expanded)}
              className={styles.expandButton}
            >
              <span className={styles.expandText}>
                {expanded
                  ? "Mostrar menos categorías"
                  : "Ver todas las categorías"}
              </span>
              {expanded ? (
                <ChevronUp
                  width="16px"
                  height="16px"
                  fill="var(--chakra-colors-accent-default)"
                />
              ) : (
                <ChevronDown
                  width="16px"
                  height="16px"
                  fill="var(--chakra-colors-accent-default)"
                />
              )}
            </button>
          </>
        )}
      </div>
    </PageContainer>
  );
}
