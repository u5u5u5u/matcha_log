"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./page.module.scss";
import MatchLogLogo from "../../public/matcha_log_logo.svg";
import Reindeer from "@/components/Reindeer";

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
        src={MatchLogLogo}
        alt="Matcha Log Logo"
        priority
      />
      <Reindeer imgUrl={"reindeer.png"} />
      <Reindeer imgUrl={"reindeer2.png"} msgPos="left" />
    </div>
  );
}
