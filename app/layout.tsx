import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TratoLibre — Alquilá y vendé objetos",
  description: "Plataforma de alquiler y venta de objetos entre personas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geist.variable} antialiased bg-white text-gray-900`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}