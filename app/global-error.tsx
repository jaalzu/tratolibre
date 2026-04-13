"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          margin: 0,
          backgroundColor: "#f9fafb",
        }}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h1
            style={{ color: "#111827", fontSize: "24px", marginBottom: "8px" }}
          >
            Vaya, algo se rompió feo
          </h1>
          <p style={{ color: "#4b5563", marginBottom: "24px" }}>
            TratoLibre experimentó un error crítico de sistema.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Refrescar página
          </button>
        </div>
      </body>
    </html>
  );
}
