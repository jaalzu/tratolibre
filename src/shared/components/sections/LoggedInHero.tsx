import NextLink from "next/link";
import Image from "next/image";
import { Button } from "@/shared/components/ui/Button";
import { PageContainer } from "@/shared/components/ui/PageContainer";
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
        <div className={styles.topSection}>
          {avatarSlot && (
            <div className={styles.avatarContainer}>{avatarSlot}</div>
          )}
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>
              {firstName ? `Bienvenido, ${firstName}` : "Bienvenido"}
            </h2>
            <div className={styles.heroImageContainer}>
              <Image
                src="/koala/hero.png"
                alt="Hero"
                width={65}
                height={65}
                priority
              />
            </div>
          </div>
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
              padding: "6px 50px",
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
