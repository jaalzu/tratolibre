"use client";

import Image from "next/image";
import { useState } from "react";
import { useProfile } from "@/shared/hooks/useProfile";
import styles from "./HeroAvatar.module.css";

export function HeroAvatar() {
  const { data, isLoading, isError } = useProfile();
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (isError || !data?.avatar_url) {
    return (
      <div className={styles.container}>
        <div className={styles.fallback}>
          {data?.name?.[0]?.toUpperCase() || "?"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Image
        src={data.avatar_url}
        alt={data.name || "Perfil"}
        fill
        priority
        sizes="55px"
        className={`${styles.image} ${isLoaded ? styles.imageLoaded : ""}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
