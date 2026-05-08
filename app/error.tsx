"use client";

import NextLink from "next/link";
import Image from "next/image";
import { AlertCircle } from "@boxicons/react";
import styles from "./error.module.css";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className={styles.root}>
      <div className={styles.logoWrapper}>
        <NextLink href="/">
          <Image
            src="/koala/logotext2.png"
            alt="TratoLibre"
            width={200}
            height={100}
            className={styles.logoImage}
          />
        </NextLink>
      </div>

      <main className={styles.main}>
        <AlertCircle className={styles.icon} />
        <h2 className={styles.title}>Algo salió mal</h2>
        <p className={styles.description}>Ocurrió un error inesperado.</p>

        <div className={styles.buttonGroup}>
          <button onClick={reset} className={styles.buttonPrimary}>
            Reintentar
          </button>
          <NextLink href="/" className={styles.buttonSecondary}>
            Volver al inicio
          </NextLink>
        </div>
      </main>
    </div>
  );
}
