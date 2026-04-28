import NextLink from "next/link";
import styles from "./Footer.module.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.borderContainer}>
          <div className={styles.grid}>
            {/* Columna 1: Branding */}
            <div>
              <h2 className={styles.brandTitle}>TratoLibre</h2>
              <p className={styles.text}>
                Cada objeto que no usás tiene valor para alguien más. Conectamos
                personas para darle una segunda vida a las cosas — más simple,
                más justo, sin intermediarios.
              </p>
            </div>

            {/* Columna 2: Explorá */}
            <div>
              <h3 className={styles.sectionTitle}>Explorá</h3>
              <nav className={styles.linkGroup}>
                <NextLink href="/item/new" className={styles.link}>
                  Publicar gratis
                </NextLink>
                <NextLink href="/how-it-works" className={styles.link}>
                  Como funciona
                </NextLink>
              </nav>
            </div>

            {/* Columna 3: Legal */}
            <div>
              <h3 className={styles.sectionTitle}>Legal</h3>
              <nav className={styles.linkGroup}>
                <NextLink href="/who-we-are" className={styles.link}>
                  Quiénes somos
                </NextLink>
                <NextLink href="/terms-and-conditions" className={styles.link}>
                  Términos y condiciones
                </NextLink>
                <NextLink href="/privacy-policy" className={styles.link}>
                  Política de privacidad
                </NextLink>
              </nav>
            </div>
          </div>

          <p className={styles.copyright}>
            © {currentYear} <span className={styles.brandSpan}>TratoLibre</span>
            . Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
