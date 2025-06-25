"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./TitleCollectionButton.module.scss";

type Props = {
  activeTitle: { id: string; name: string } | null;
};

export default function TitleCollectionButton({ activeTitle }: Props) {
  const router = useRouter();

  return (
    <div className={styles.titleContainer}>
      {!activeTitle && <p className={styles.noTitle}>称号なし</p>}
      <button
        className={styles.titleCollectionButton}
        onClick={() => {
          router.push("/titles");
        }}
      >
        コレクション
      </button>
    </div>
  );
}
