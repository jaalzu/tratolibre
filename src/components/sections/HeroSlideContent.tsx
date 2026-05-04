import Image from "next/image";
import NextLink from "next/link";
import { Button } from "@/components/ui/Button";
import styles from "./Hero.module.css";

export function HeroSlideContent({ slide, priority }: any) {
  return (
    <div style={{ "--slide-bg": slide.bg } as React.CSSProperties}>
      {/* Mobile */}
      <div className={styles.mobileContainer}>
        <div className={styles.imageWrapperMobile}>
          <Image
            src={slide.image}
            alt={slide.title}
            width={1200}
            height={600}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
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
          <Button asChild style={{ padding: "6px 22px" }}>
            <NextLink href={slide.buttonHref}>{slide.buttonLabel}</NextLink>
          </Button>
        </div>

        <div className={styles.imageWrapperDesktop}>
          <Image
            src={slide.image}
            alt={slide.title}
            width={1400}
            height={700}
            sizes="(max-width: 768px) 100vw, 412px"
            quality={60}
            className={styles.image}
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      </div>
    </div>
  );
}
