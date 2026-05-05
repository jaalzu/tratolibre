import NextLink from "next/link";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import styles from "./LoggedInHero.module.css";

interface LoggedInHeroProps {
  name: string | null;
  avatarSlot?: React.ReactNode;
}

function getFirstName(name: string | null) {
  if (!name) return null;
  const firstName = name.split(" ")[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

export function LoggedInHero({ name, avatarSlot }: LoggedInHeroProps) {
  const firstName = getFirstName(name);

  return (
    <PageContainer pt={0} pb={3}>
      <div className={styles.heroWrapper}>
        {avatarSlot && (
          <div className={styles.avatarContainer}>{avatarSlot}</div>
        )}

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
              padding: "6px 42px",
              fontSize: "0.975rem",
            }}
          >
            <NextLink href="/search">Explorar</NextLink>
          </Button>

          <Button
            asChild
            size="sm"
            style={{
              padding: "6px 49px",
              fontSize: "0.975rem",
            }}
          >
            <NextLink href="/item/new">Vender</NextLink>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
