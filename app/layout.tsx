import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Box } from "@chakra-ui/react";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TratoLibre — Compra y vende objetos",
  description: "Marketplace de objetos usados entre personas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/hero/girl-in-pool.webp"
          fetchPriority="high"
        />
      </head>
      <body className={geist.variable} suppressHydrationWarning>
        <Providers>
          <Box bg="neutral.150" minH="100vh">
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}