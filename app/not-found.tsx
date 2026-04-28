import NextLink from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import styles from "./Not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.root}>
      <div className={styles.logoWrapper}>
        <NextLink href="/" className={styles.logo}>
          TratoLibre
        </NextLink>
      </div>

      <main className={styles.main}>
        <EmptyState
          image="/404.webp"
          imageAlt="Perro comiendo la página"
          title="¡Parece que un perro se comió esta página!"
          description="No encontramos lo que buscabas. Quizás ya no existe o nunca existió."
          actionLabel="Volver al inicio"
          actionHref="/"
        />
      </main>
    </div>
  );
}
