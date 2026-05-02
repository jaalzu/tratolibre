import NextLink from "next/link";
import Image from "next/image";
import { Item } from "@/features/items/types";
import {
  ITEM_IMAGE_SIZE,
  ITEM_IMAGE_QUALITY,
} from "@/features/items/constants";

import styles from "./ItemCard.module.css";

import { FavoriteButtonClient } from "@/components/ui/FavoriteButtonClient";

interface ItemCardProps {
  obj: Item;
  userId?: string | null;
  initialFavorited?: boolean;
  priority?: boolean;
}

export const ItemCard = ({
  obj,
  userId = null,
  initialFavorited,
  priority = false,
}: ItemCardProps) => {
  return (
    <NextLink href={`/item/${obj.id}`} className={styles.linkWrapper}>
      <div className={styles.card}>
        {/* Contenedor de Imagen */}
        <div className={styles.imageContainer}>
          {obj.images?.[0] ? (
            <Image
              src={obj.images[0]}
              alt={obj.title}
              fill
              sizes="(max-width: 768px) 50vw, 190px"
              quality={60}
              className={styles.image}
              priority={priority}
            />
          ) : (
            <div className={styles.placeholder} />
          )}
        </div>

        {/* Info del Producto */}
        <div className={styles.content}>
          <div className={styles.priceRow}>
            {obj.sale_price && (
              <span className={styles.price}>
                ${obj.sale_price.toLocaleString("es-AR")}
              </span>
            )}

            <FavoriteButtonClient
              itemId={obj.id}
              userId={userId}
              initialFavorited={initialFavorited}
            />
          </div>

          <p className={styles.title}>{obj.title}</p>
        </div>
      </div>
    </NextLink>
  );
};
