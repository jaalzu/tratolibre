// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Providers } from "./providers";
import { createClient } from "@/lib/supabase/server";
import { ClientProviders } from "./ClientProviders";
import { AnalyticsWrapper } from "./AnalyticsWrapper";
import { Box } from "@chakra-ui/react";
import { error } from "console";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
  preload: true,
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: "#1A202C",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "TratoLibre — Compra y vende objetos",
    template: "%s | TratoLibre",
  },
  description: "Marketplace de objetos usados entre personas",
  openGraph: {
    title: "TratoLibre — Compra y vende objetos",
    description: "Marketplace de objetos usados entre personas",
    siteName: "TratoLibre",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TratoLibre — Compra y vende objetos",
    description: "Marketplace de objetos usados entre personas",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="es" className={geist.variable} suppressHydrationWarning>
      <head></head>
      <body className={geist.className} suppressHydrationWarning>
        <Providers>
          <ClientProviders userId={user?.id}>
            <Toaster />
            <main className="app-container" suppressHydrationWarning>
              {children}
            </main>
          </ClientProviders>
        </Providers>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
