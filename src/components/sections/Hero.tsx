import { Button } from "@/components/ui/Button";
import Image from "next/image";
import NextLink from "next/link";
import { HeroCarousel } from "./HeroCarousel";
import styles from "./Hero.module.css";

interface HeroSlide {
  image: string;
  title: string;
  buttonLabel: string;
  buttonHref: string;
  bg: string;
}

function getSlides(isLoggedIn: boolean): HeroSlide[] {
  return [
    {
      image: "/hero/girl-in-pool.webp",
      title:
        "Compra, venta e intercambio de artículos de segunda mano y nuevos.",
      buttonLabel: "Vender Ahora",
      buttonHref: isLoggedIn ? "/item/new" : "/register",
      bg: "var(--chakra-colors-brand-100)",
    },
    {
      image: "/hero/handshake.webp",
      title: "¡Es rápido, fácil y gratis!",
      buttonLabel: "Comenzar a Vender",
      buttonHref: isLoggedIn ? "/item/new" : "/register",
      bg: "var(--chakra-colors-accent-100)",
    },
  ];
}

export function HeroSlideContent({
  slide,
  priority,
}: {
  slide: HeroSlide;
  priority?: boolean;
}) {
  return (
    <div style={{ "--slide-bg": slide.bg } as React.CSSProperties}>
      {/* Mobile */}
      <div className={styles.mobileContainer}>
        <div className={styles.imageWrapperMobile}>
          <Image
            src={slide.image}
            alt={slide.title}
            width={1200}
            height={800}
            sizes="100vw"
            className={styles.image}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
          />
        </div>
        <div className={styles.contentMobile}>
          <h2 className={styles.headingMobile}>{slide.title}</h2>
          <Button asChild style={{ padding: "6px 32px" }}>
            <NextLink href={slide.buttonHref}>{slide.buttonLabel}</NextLink>
          </Button>
        </div>
      </div>

      {/* Desktop */}
      <div className={styles.desktopContainer}>
        <div className={styles.infoCol}>
          <h2 className={styles.headingDesktop}>{slide.title}</h2>
          <Button
            asChild
            style={{
              width: "fit-content",
              padding: "4px 16px",
              fontSize: "0.875rem",
              borderRadius: "9999px",
            }}
          >
            <NextLink href={slide.buttonHref}>{slide.buttonLabel}</NextLink>
          </Button>
        </div>
        <div className={styles.imageWrapperDesktop}>
          <Image
            src={slide.image}
            alt={slide.title}
            width={1800}
            height={800}
            sizes="(max-width: 868px) 100vw, 70vw"
            className={styles.image}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
          />
        </div>
      </div>
    </div>
  );
}

export function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const slides = getSlides(isLoggedIn);
  return <HeroCarousel slides={slides} />;
}
