import NextLink from "next/link";
import { PageContainer } from "@/components/ui/PageContainer";
import { ItemCard } from "@/features/items/components/home/ItemCard";
import { Item } from "@/features/items/types";
import styles from "./ItemsCategorySection.module.css";

interface ItemsRowProps {
  title: string;
  items: Item[];
  viewMoreHref?: string;
  viewMoreLabel?: string;
  userId?: string | null;
  isPrioritySection?: boolean;
}

export const ItemsCategorySection = ({
  title,
  items,
  viewMoreHref,
  viewMoreLabel = "Ver más",
  userId = null,
  isPrioritySection = false,
}: ItemsRowProps) => {
  if (!items.length) return null;

  return (
    <PageContainer pt={{ base: 4, md: 8 }} pb={4}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {viewMoreHref && (
            <NextLink href={viewMoreHref} className={styles.viewMore}>
              {viewMoreLabel}
            </NextLink>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.scrollArea}>
          <div
            className={styles.grid}
            style={{ "--items-count": items.length } as React.CSSProperties}
          >
            {items.map((obj: Item, index: number) => (
              <ItemCard
                key={obj.id}
                obj={obj}
                userId={userId}
                priority={isPrioritySection && index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
