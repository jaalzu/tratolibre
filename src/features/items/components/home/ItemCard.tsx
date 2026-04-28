import NextLink from "next/link";
import Image from "next/image";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { Item } from "@/features/items/types";
import {
  ITEM_IMAGE_SIZE,
  ITEM_IMAGE_QUALITY,
} from "@/features/items/constants";

// Importamos los estilos del module.css
import styles from "./ItemCard.module.css";

interface ItemCardProps {
  obj: Item;
  userId?: string | null;
  initialFavorited?: boolean;
  priority?: boolean;
}

export const ItemCard = ({
  obj,
  userId = null,
  initialFavorited = false,
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
              sizes={ITEM_IMAGE_SIZE}
              quality={ITEM_IMAGE_QUALITY}
              className={styles.image}
              priority={priority}
              loading={priority ? "eager" : "lazy"}
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

            <FavoriteButton
              itemId={obj.id}
              initialFavorited={initialFavorited}
              userId={userId}
            />
          </div>

          <p className={styles.title}>{obj.title}</p>
        </div>
      </div>
    </NextLink>
  );
};
