import NextLink from "next/link";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import styles from "./not-found.module.css";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className={styles.root}>
      <div className={styles.logoWrapper}>
        <NextLink href="/">
          <Image
            src="/koala/logotext.webp"
            alt="TratoLibre Inicio"
            width={140}
            height={35}
            priority
            className={styles.logoImage}
          />
        </NextLink>
      </div>

      <main className={styles.main}>
        <EmptyState
          image="/koala/404.webp"
          imageAlt="Koala no encuentra la pagina que buscas"
          title="¡Parece que no existe la pagina que buscas!"
          description="No encontramos lo que buscabas. Quizás ya no existe o nunca existió."
          actionLabel="Volver al inicio"
          actionHref="/"
        />
      </main>
    </div>
  );
}
