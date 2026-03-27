import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Box } from "@chakra-ui/react";
import "boxicons/css/boxicons.min.css";
import { createClient } from "@/lib/supabase/server";
import { ChatStoreInit } from "@/features/chat/components/ChatStoreInit";
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="es" suppressHydrationWarning>
      <body className={geist.variable} suppressHydrationWarning>
        <Providers>
          <ChatStoreInit userId={user?.id} />
          <Box bg="neutral.150" minH="100dvh">
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
