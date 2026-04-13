"use client";

import NextLink from "next/link";
// Importa el icono directamente si es posible para evitar el barrel
import { AlertCircle } from "@boxicons/react";

export default function Error({ reset }: { reset: () => void }) {
  return (
    // Usamos div con clases de Tailwind o variables CSS de Chakra
    <div className="min-h-[100dvh] relative flex flex-col items-center justify-center p-6 bg-[var(--chakra-colors-neutral-50)]">
      {/* Logo / Link */}
      <div className="absolute top-6 left-6">
        <NextLink
          href="/"
          className="text-xl font-bold text-[var(--chakra-colors-neutral-900)] no-underline"
        >
          TratoLibre
        </NextLink>
      </div>

      {/* Si EmptyState es muy pesado, considera meter el HTML 
         aquí directamente para esta página específica 
      */}
      <div className="text-center">
        <AlertCircle
          width="64px"
          height="64px"
          fill="var(--chakra-colors-feedback-error)"
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2 text-[var(--chakra-colors-neutral-800)]">
          Algo salió mal
        </h2>
        <p className="text-[var(--chakra-colors-neutral-600)] mb-6">
          Ocurrió un error inesperado.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-[var(--chakra-colors-brand-500)] text-white rounded-md font-medium"
          >
            Reintentar
          </button>
          <NextLink
            href="/"
            className="px-4 py-2 border border-[var(--chakra-colors-neutral-200)] rounded-md font-medium"
          >
            Volver al inicio
          </NextLink>
        </div>
      </div>
    </div>
  );
}
