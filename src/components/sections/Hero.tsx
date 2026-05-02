import { HeroSlideContent } from "./HeroSlideContent";

import { HeroCarouselClient } from "./HeroCarouselClient";

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

export function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  const slides = getSlides(isLoggedIn);

  return (
    <div>
      <div id="hero-static">
        <HeroSlideContent slide={slides[0]} priority />
      </div>

      <HeroCarouselClient slides={slides} />
    </div>
  );
}
