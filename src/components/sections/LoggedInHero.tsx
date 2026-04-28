import NextLink from "next/link";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import styles from "./LoggedInHero.module.css";

interface LoggedInHeroProps {
  name: string | null;
}

function getFirstName(name: string | null) {
  if (!name) return null;
  const firstName = name.split(" ")[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

export function LoggedInHero({ name }: LoggedInHeroProps) {
  const firstName = getFirstName(name);

  return (
    /* Usamos el PageContainer que ya optimizamos con pt/pb */
    <PageContainer pt={6} pb={2}>
      <div className={styles.heroWrapper}>
        <div>
          <h2 className={styles.title}>
            {firstName ? `Bienvenido, ${firstName}` : "Bienvenido"}
          </h2>
          <p className={styles.description}>
            Compra y vende artículos nuevos o usados fácilmente.
          </p>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            asChild
            size="sm"
            className={styles.btnExplorar}
            style={{
              padding: "6px 32px", // base px 8
              fontSize: "0.875rem", // sm
            }}
          >
            <NextLink href="/search">Explorar</NextLink>
          </Button>

          <Button
            asChild
            size="sm"
            style={{
              padding: "6px 32px", // base px 8
              fontSize: "0.875rem", // sm
            }}
          >
            <NextLink href="/item/new">Vender</NextLink>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
