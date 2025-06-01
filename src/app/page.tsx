"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./page.module.scss";

export default function Home() {
  const router = useRouter();
  return (
    <div
      className={styles.page + " " + styles.logoCenter}
      onClick={() => router.push("/posts")}
      tabIndex={0}
      role="button"
      aria-label="投稿一覧へ"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") router.push("/posts");
      }}
    >
      <Image
        className={styles.logo}
        src="/matcha_log_logo.svg"
        alt="Matcha Log Logo"
        width={393}
        height={288}
        priority
      />
    </div>
  );
}
