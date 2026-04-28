"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteItems } from "@/features/items/hooks/useInfiniteItems";
import { ItemCard } from "./ItemCard";
import { FadeInGrid } from "@/components/ui/FadeInGrid";
import styles from "./InfiniteGrid.module.css";

interface InfiniteGridProps {
  userId: string | null;
  favoriteIds: string[];
}

export function InfiniteGrid({ userId, favoriteIds }: InfiniteGridProps) {
  const [isNear, setIsNear] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          trigger.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    if (containerRef.current) trigger.observe(containerRef.current);
    return () => trigger.disconnect();
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteItems({
      enabled: isNear,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allItems = data?.pages.flat().filter(Boolean) || [];

  return (
    <div ref={containerRef} className={styles.container}>
      <h2 className={styles.title}>Explorar</h2>

      <FadeInGrid>
        {allItems.map((item, index) => (
          <ItemCard
            key={item.id}
            obj={item}
            userId={userId}
            initialFavorited={favoriteIds.includes(item.id)}
            priority={index < 4}
          />
        ))}
      </FadeInGrid>

      <div ref={observerRef} className={styles.observer} />

      {(isFetchingNextPage || (isNear && !data)) && (
        <div className={styles.loaderWrapper}>
          <span className={styles.spinner} />
        </div>
      )}
    </div>
  );
}
