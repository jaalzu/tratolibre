"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("./Footer").then((mod) => mod.Footer), {
  ssr: true,
});

const EXCLUDED = ["/chat", "/item/new", "/profile/edit"];

export const FooterWrapper = () => {
  const pathname = usePathname();

  const hide =
    EXCLUDED.some((path) => pathname.startsWith(path)) ||
    pathname.includes("/edit");

  if (hide) return null;

  return <Footer />;
};
