"use client";

import { Star } from "@boxicons/react";
import type { NotificationConfig } from "../types";

interface NotificationLabelProps {
  label: NotificationConfig["label"];
}

/**
 * Componente para renderizar el label de una notificación
 * Soporta tanto strings simples como labels con rating
 */
export function NotificationLabel({ label }: NotificationLabelProps) {
  if (typeof label === "string") {
    return <>{label}</>;
  }

  return (
    <span>
      {label.text} {label.rating}
      <Star
        width="13px"
        height="13px"
        fill="black"
        style={{
          display: "inline-block",
          marginLeft: "2px",
          verticalAlign: "middle",
        }}
      />
    </span>
  );
}
